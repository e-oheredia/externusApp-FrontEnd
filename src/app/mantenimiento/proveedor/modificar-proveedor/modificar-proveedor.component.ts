import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
    private proveedorService: ProveedorService,
    private notifier: NotifierService
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  modificarForm: FormGroup;

  modificarProveedorSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombreProveedor' : new FormControl(this.proveedor.nombre, Validators.required),
      // 'plazosProveedor' : new FormControl(this.proveedor.plazosDistribucion, Validators.required),
      'activo' : new FormControl(this.proveedor.activo, Validators.required)
    })
  }

  onSubmit(form: any){
    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombreProveedor'].value)){
      this.proveedor.nombre = this.modificarForm.get("nombreProveedor").value;
      this.proveedor.activo = this.modificarForm.get('activo').value;
      this.modificarProveedorSubscription = this.proveedorService.modificarProveedor(this.proveedor.id, this.proveedor).subscribe(
        proveedor => {
          this.notifier.notify('success', 'SE MODIFICÓ EL PROVEEDOR CON ÉXITO');
          this.bsModalRef.hide();
          this.confirmarEvent.emit();
        }
      )
    }
  }

}
