import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { ProductoService } from 'src/app/shared/producto.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Producto } from 'src/model/producto.model';
import { AppSettings } from 'src/app/shared/app.settings';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { ModificarProductoComponent } from './modificar-producto/modificar-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private tituloService: TituloService,
    public productoService: ProductoService
  ) { }

  dataProductos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  producto: Producto;
  productos: Producto[] = [];

  productosSubscription: Subscription;
  productoForm: FormGroup;

  ngOnInit() {
    this.tituloService.setTitulo("Mantenimiento de Producto");
    this.generarColumnas();
    this.listarProductos();
  }

  generarColumnas(){
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      estado: {
        title: 'Estado'
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction : (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarProducto(row);
          });
        }
      }
    }
  }

  listarProductos(){
    this.dataProductos.reset();
    this.productoService.listarProductosAll().subscribe(
      productos => {
        this.productos = productos;
        let dataProductos = [];
        productos.forEach(
          producto => {
            dataProductos.push({
              id: producto.id,
              nombre: producto.nombre,
              estado: producto.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataProductos.load(dataProductos);
      }
    )
  }

  onAgregar(){
    this.agregarProducto();
  }

  agregarProducto(){
    let bsModalRef: BsModalRef = this.modalService.show(AgregarProductoComponent, {
      initialState: {
        titulo: 'Agregar producto',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.productoCreadoEvent.subscribe(() => 
    this.listarProductos()
    )
  }

  modificarProducto(row){
    this.producto = this.productos.find(producto => producto.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarProductoComponent, {
      initialState: {
        id: this.producto.id,
        producto: this.producto,
        titulo: 'Modificar el producto'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.productoModificadoEvent.subscribe(() => {
      this.productoService.modificarProducto(this.producto.id, this.producto).subscribe(
        () => {
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se modificó el producto correctamente"
            }
          });
          this.listarProductos();
        },
        error => {

        }
      )
    });
  }

}
