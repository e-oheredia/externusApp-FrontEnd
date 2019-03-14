import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agregar-proveedor',
  templateUrl: './agregar-proveedor.component.html',
  styleUrls: ['./agregar-proveedor.component.css']
})
export class AgregarProveedorComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private proveedorService: ProveedorService
  ) { }

  @Output() proveedorCreadoEvent = new EventEmitter<Proveedor>();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  agregarForm: FormGroup;

  crearProveedorSubscription: Subscription;

  ngOnInit() {
    this.agregarForm = new FormGroup({
      'nombreProveedor' : new FormControl('', Validators.required),
      'plazosProveedor' : new FormControl('', Validators.required),
      // 'plazo' : new FormControl( ,Validators.required)
    })
  }

  onSubmit(proveedor){
    this.crearProveedorSubscription = this.proveedorService.agregarProveedor(proveedor).subscribe(
      proveedor => {
        this.notifier.notify('succes', 'Se ha registrado el proveedor');
        this.bsModalRef.hide();
        this.proveedorCreadoEvent.emit(proveedor);
      },
      error => {
        this.notifier.notify('error', error.error.mensaje);
      }
    )
  }


  

}
