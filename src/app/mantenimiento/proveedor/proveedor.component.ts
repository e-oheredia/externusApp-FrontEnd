import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from 'src/app/shared/utils.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { Proveedor } from 'src/model/proveedor.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { ModificarProveedorComponent } from './modificar-proveedor/modificar-proveedor.component';
import { AgregarProveedorComponent } from './agregar-proveedor/agregar-proveedor.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  constructor(
    public proveedorService: ProveedorService,
    private modalService: BsModalService,
    private tituloService: TituloService,
    private notifier: NotifierService,
    private utilsService: UtilsService
  ) { }

  settings = AppSettings.tableSettings;
  dataProveedores : LocalDataSource = new LocalDataSource();
  proveedores : Proveedor[] = [];
  proveedor : Proveedor;

  proveedoresSubscription: Subscription;
  proveedorForm: FormGroup;

  ngOnInit() {
    this.tituloService.setTitulo("Mantenimiento de proveedores");
    this.generarColumnas();
    this.listarProveedores();
  }

  generarColumnas(){
    this.settings.columns = {
      id: {
        title : 'ID'
      },
      nombre: {
        title : 'Nombre'
      },
      plazos: {
        title : 'Plazos de distribución'
      },
      buttonModificar: {
        title : 'Modificar',
        type : 'custom',
        renderComponent : ButtonViewComponent,
        onComponentInitFunction : (instance : any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarProveedor(row);
          });
        }
      }
    }
  }

  listarProveedores(){
    this.dataProveedores.reset();
    this.proveedorService.listarProveedores().subscribe(
      proveedores => {
        this.proveedores = proveedores;
        let dataProveedores = [];
        proveedores.forEach(
          proveedor => {
            dataProveedores.push({
              id: proveedor.id,
              nombre: proveedor.nombre,
              plazos: proveedor.plazosDistribucion.map(plazoDistribucion => plazoDistribucion.nombre).join(", ")
            })
          }
        )
        this.dataProveedores.load(dataProveedores);
      }
    )
  }

  onAgregar(){
    this.agregarProveedor();
  }

  agregarProveedor(){
    let bsModalRef: BsModalRef = this.modalService.show(AgregarProveedorComponent, {
      initialState: {
        titulo: 'Agregar proveedor'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.proveedorCreadoEvent.subscribe(() =>
      this.listarProveedores()
    )
  }

  modificarProveedor(row){
    this.proveedor = this.proveedores.find(proveedor => proveedor.id == row.id)
  
    let bsModalRef: BsModalRef = this.modalService.show(ModificarProveedorComponent, {
      initialState: {
        proveedor: this.proveedor,
        titulo: 'Modificar proveedor'
      },
      class: "modal-lg",
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.proveedorService.modificarProveedor(this.proveedor).subscribe(
        () => {
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se modificó el proveedor correctamente"
            }
          });
          this.listarProveedores();
        },
        error => {

        }
      )
    });
  }




}