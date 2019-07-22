import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { TipoServicio } from 'src/model/tiposervicio.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { TipoServicioService } from 'src/app/shared/tiposervicio.service';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { AgregarTipoServicioComponent } from './agregar-tiposervicio/agregar-tiposervicio.component';
import { ModificarTipoServicioComponent } from './modificar-tiposervicio/modificar-tiposervicio.component';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.css']
})
export class TipoServicioComponent implements OnInit {

  constructor(
    public tipoServicioService: TipoServicioService,
    private modalService: BsModalService,
    private tituloService: TituloService
  ) { }

  dataTipoServicio: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  servicios: TipoServicio[] = [];
  servicio: TipoServicio;

  serviciosSubscription: Subscription;
  servicioForm: FormGroup;

  ngOnInit() {
    this.tituloService.setTitulo("Mantenimiento de Tipo de Servicio");
    this.generarColumnas();
    this.listarTiposDeServicio();
    this.settings.hideSubHeader = false;
  }

  generarColumnas() {
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
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarTipoServicio(row);
          });
        }
      }
    }
  }


  listarTiposDeServicio() {
    this.dataTipoServicio.reset();
    this.tipoServicioService.listarTiposServicioAll().subscribe(
      servicios => {
        this.servicios = servicios;
        let dataTipoServicio = [];
        servicios.forEach(
          servicio => {
            dataTipoServicio.push({
              id: servicio.id,
              nombre: servicio.nombre,
              estado: servicio.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataTipoServicio.load(dataTipoServicio);
      }
    )
  }


  onAgregar() {
    this.agregarTipoServicio();
  }

  agregarTipoServicio() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarTipoServicioComponent, {
      initialState: {
        titulo: 'Agregar tipo de servicio',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.tipoServicioCreadoEvent.subscribe(() =>
      this.listarTiposDeServicio()
    )
  }


  modificarTipoServicio(row) {
    this.servicio = this.servicios.find(servicio => servicio.id == row.id)

    let bsModalRef: BsModalRef = this.modalService.show(ModificarTipoServicioComponent, {
      initialState: {
        id: this.servicio.id,
        servicio: this.servicio,
        titulo: 'Modificar el tipo de servicio de la distribucion'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.tipoServicioModificarEvent.subscribe(() =>
      this.listarTiposDeServicio()
    )
  }


}
