import { UtilsService } from './../../shared/utils.service';
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
    private notifier: NotifierService,
    private utilsService: UtilsService
  ) { }

  guia: Guia;
  guiaForm: FormGroup;
  proveedor : Proveedor;
  @Output() guiaModificadaEvent = new EventEmitter();
  proveedores: Proveedor[];
  proveedores2 : Proveedor[];
  proveedoresSubscription: Subscription; //= new Subscription();
  modificarGuiaSubscription: Subscription; //= new Subscription();

  ngOnInit() {
    this.proveedores = this.proveedorService.getProveedores();
    this.guiaForm = new FormGroup({
      'proveedor':  new FormControl(null, Validators.required),
      'numeroGuia': new FormControl(this.guia.numeroGuia, [Validators.required, Validators.minLength(5), Validators.maxLength(20)])
    });
    this.cargarDatosVista(this.guia);
  }



  cargarDatosVista(guia) {

    
    //this.proveedores = this.proveedorService.getProveedores();


    if (!this.utilsService.isUndefinedOrNull(this.proveedores)) {
      this.proveedores2 = this.proveedorService.getProveedorByRegionId(guia.regionId);
      this.guiaForm.controls['proveedor'].setValue(this.proveedores2.find(proveedor => proveedor.id === guia.proveedor.id));
    }else{
      this.proveedoresSubscription = this.proveedorService.proveedoresChanged.subscribe(
        proveedores => {
          this.proveedores = proveedores;//
          this.proveedores2 = this.proveedorService.getProveedorByRegionId(guia.regionId);          
          this.guiaForm.controls['proveedor'].setValue(this.proveedores2.find(proveedor => proveedor.id ===guia.proveedor.id));
        },
        error => {
          this.notifier.notify('error', "error en la ejecución");
        }
      );
    }

    
  }
//this.proveedores = this.proveedorService.getProveedorByRegionId2(guia.regionId,proveedores);

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
/*     this.proveedoresSubscription.unsubscribe();
    this.modificarGuiaSubscription.unsubscribe(); */
  }

}
