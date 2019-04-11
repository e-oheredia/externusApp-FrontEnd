import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { Subscription } from 'rxjs';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.css']
})
export class ModificarProveedorComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private bsModalRef: BsModalRef,
    private plazoDistribucionService: PlazoDistribucionService , 
    private proveedorService: ProveedorService,
    private notifier: NotifierService

  ) { }

  @Output() confirmarEvent = new EventEmitter();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  modificarForm: FormGroup;
  plazosDistribucion:  PlazoDistribucion[];
  plazosDistribucionElegidos: PlazoDistribucion[];

  modificarProveedorSubscription: Subscription;

  
 ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombreProveedor' : new FormControl(this.proveedor.nombre, Validators.required),
      'activo' : new FormControl(this.proveedor.activo, Validators.required),
      'plazos': new FormArray([])
    });
    this.listarPlazosDistribucion();
    this.plazosDistribucionElegidos = this.proveedor.plazosDistribucion;
  }

  listarPlazosDistribucion() {
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();

    if (this.plazosDistribucion) {
      this.plazosDistribucion.forEach(plazo => {
        const control = new FormControl(this.proveedor.plazosDistribucion.findIndex(plazoProveedor => plazoProveedor.id === plazo.id) > -1);
        (<FormArray>this.modificarForm.get('plazos')).push(control);
      });
    }

    this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
      plazosDistribucion => {
        this.plazosDistribucion = plazosDistribucion;
        plazosDistribucion.forEach(plazo => {
          const control = new FormControl(this.proveedor.plazosDistribucion.findIndex(plazoProveedor => plazoProveedor.id === plazo.id) > -1);
          (<FormArray>this.modificarForm.get('plazos')).push(control);
        });
      }
    )
  }

  onSubmit(form: any){
    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombreProveedor'].value)){
      let nombreSinEspacios = this.modificarForm.controls['nombreProveedor'].value.trim();
      this.proveedor.nombre = nombreSinEspacios;
      this.proveedor.activo = this.modificarForm.get('activo').value;
      this.modificarProveedorSubscription = this.proveedorService.modificarProveedor(this.proveedor.id, this.proveedor).subscribe(
        proveedor => {
          this.notifier.notify('success', 'Se ha modificado el proveedor correctamente');
          this.bsModalRef.hide();
          this.confirmarEvent.emit(proveedor);
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
      )
    }
  }

  onChangePlazoDistribucionElegido(event: any, plazoDistribucion: PlazoDistribucion) {
    
    event.srcElement.checked ? this.plazosDistribucionElegidos.push(plazoDistribucion) : this.plazosDistribucionElegidos.splice(this.plazosDistribucionElegidos.indexOf(this.plazosDistribucionElegidos.find(plazo => plazo.id === plazoDistribucion.id)), 1);
  }


  
 

}
