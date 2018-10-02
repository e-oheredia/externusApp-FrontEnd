import { GuiaService } from '../../shared/guia.service';
import { Guia } from '../../../model/guia.model';
import { ProveedorService } from '../../shared/proveedor.service';
import { Subscription } from 'rxjs';
import { Proveedor } from '../../../model/proveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-modificar-guia-modal',
  templateUrl: './modificar-guia-modal.component.html',
  styleUrls: ['./modificar-guia-modal.component.css']
})

export class ModificarGuiaModalComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private proveedorService: ProveedorService,
    private guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  guia: Guia;
  guiaForm: FormGroup;

  @Output() guiaModificadaEvent = new EventEmitter();
  proveedores: Proveedor[];

  proveedoresSubscription: Subscription;
  modificarGuiaSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.cargarDatosVista();
    this.guiaForm = new FormGroup({
      'proveedor': new FormControl(this.guia.proveedor, Validators.required),
      'numeroGuia': new FormControl(this.guia.numeroGuia, [Validators.required, Validators.minLength(5)])
    });
  }

  cargarDatosVista() {    
    this.proveedores = this.proveedorService.getProveedores();
    this.proveedoresSubscription = this.proveedorService.proveedoresChanged.subscribe(
      proveedores => {
        this.proveedores = proveedores;
      }
    );
  }

  onSubmit(guia) {
    guia.id = this.guia.id;
    this.modificarGuiaSubscription = this.guiaService.modificarGuia(guia).subscribe(
      guia => {
        this.notifier.notify('success', 'Se ha modificado la guía correctamente');
        this.bsModalRef.hide();
        this.guiaModificadaEvent.emit();
      },
      error => {
        this.notifier.notify('error', error.error.mensaje);
      }
    )
  }



  ngOnDestroy() {
    //this.proveedoresSubscription.unsubscribe();
    this.modificarGuiaSubscription.unsubscribe();
  }

}
