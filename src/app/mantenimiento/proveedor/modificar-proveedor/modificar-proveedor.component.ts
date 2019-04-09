import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';

@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.css']
})
export class ModificarProveedorComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private bsModalRef: BsModalRef,
    private plazoDistribucionService: PlazoDistribucionService  
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  modificarForm: FormGroup;
  plazosDistribucion:  PlazoDistribucion[];
  plazosDistribucionElegidos: PlazoDistribucion[];


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

  onSubmit(proveedorFormValue: any){

    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombreProveedor'].value)){
      this.proveedor.nombre = this.modificarForm.get("nombreProveedor").value;
      this.proveedor.activo = this.modificarForm.get('activo').value;
      // plazos de distribucion
    }
    this.bsModalRef.hide();
    this.confirmarEvent.emit();
  }

  onChangePlazoDistribucionElegido(event: any, plazoDistribucion: PlazoDistribucion) {
    
    event.srcElement.checked ? this.plazosDistribucionElegidos.push(plazoDistribucion) : this.plazosDistribucionElegidos.splice(this.plazosDistribucionElegidos.indexOf(this.plazosDistribucionElegidos.find(plazo => plazo.id === plazoDistribucion.id)), 1);
  }


  
 

}
