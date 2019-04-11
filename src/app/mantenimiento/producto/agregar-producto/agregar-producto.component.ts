import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductoService } from 'src/app/shared/producto.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { Producto } from 'src/model/producto.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css']
})
export class AgregarProductoComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private bsModalRef: BsModalRef,
    private notifier: NotifierService
  ) { }

  @Output() productoCreadoEvent = new EventEmitter<Producto>();

  producto: Producto;
  productos: Producto[] = [];
  agregarForm: FormGroup;

  crearProductoSubscription: Subscription;

  ngOnInit() {
    this.agregarForm = new FormGroup({
      'nombre' : new FormControl('', Validators.required),
    })
  }

  onSubmit(producto) {
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (this.agregarForm.controls['nombre'].value.length !== 0) {
      producto.nombre = nombreSinEspacios;
      this.crearProductoSubscription = this.productoService.agregarProducto(producto).subscribe(
        plazo => {
          this.notifier.notify('success', 'Se ha agregado el producto correctamente');
          this.bsModalRef.hide();
          this.productoCreadoEvent.emit(producto);
        },
        error => {
          this.notifier.notify('error', 'No se puede agregar un nombre existente');
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el nombre del producto');
    }
  }

}

