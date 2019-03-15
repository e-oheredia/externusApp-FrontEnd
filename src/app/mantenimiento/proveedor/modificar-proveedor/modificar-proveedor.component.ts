import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.css']
})
export class ModificarProveedorComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private bsModalRef: BsModalRef
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  modificarForm: FormGroup;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombreProveedor' : new FormControl(this.proveedor.nombre, Validators.required),
      // 'plazosProveedor' : new FormControl(this.proveedor.plazosDistribucion, Validators.required),
      'activo' : new FormControl("0", Validators.required)
    })
  }

  onSubmit(proveedorFormValue: any){

    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombreProveedor'].value)){
      this.proveedor.nombre = proveedorFormValue.nombreProveedor;
      this.proveedor.activo = proveedorFormValue.activo === "1";
      // plazos de distribucion
      // this.proveedor.estado = this.modificarForm.get("estadoProveedor").value;
    }
    this.bsModalRef.hide();
    this.confirmarEvent.emit();
  }

}
