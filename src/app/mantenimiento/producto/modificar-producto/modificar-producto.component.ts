import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { ProductoService } from 'src/app/shared/producto.service';
import { Producto } from 'src/model/producto.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private productoService: ProductoService
  ) { }

  @Output() productoModificadoEvent = new EventEmitter();

  estados: boolean;
  producto: Producto;
  productos: Producto[] = [];
  modificarForm: FormGroup;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.producto.nombre, Validators.required),
      'activo': new FormControl(this.producto.activo, Validators.required)
    })
  }  

  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)){
      this.producto.nombre = this.modificarForm.get("nombre").value;
      this.producto.activo = this.modificarForm.get('activo').value;
    }
    this.bsModalRef.hide();
    this.productoModificadoEvent.emit();
  }

}
