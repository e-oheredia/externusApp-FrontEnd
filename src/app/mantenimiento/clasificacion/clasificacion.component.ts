import { Component, OnInit } from '@angular/core';
import { Clasificacion } from 'src/model/clasificacion.model';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';
import { AppSettings } from 'src/app/shared/app.settings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { AgregarClasificacionComponent } from './agregar-clasificacion/agregar-clasificacion.component';
import { ModificarClasificacionComponent } from './modificar-clasificacion/modificar-clasificacion.component';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.css']
})
export class ClasificacionComponent implements OnInit {

  constructor(
    public clasificacionService: ClasificacionService,
    private modalService: BsModalService,
    private notifier: NotifierService,
    private tituloService: TituloService
  ) { }

  dataClasificacion: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  clasificacion: Clasificacion;
  clasificaciones: Clasificacion[] = [];

  clasificacionSubscription: Subscription;
  clasificacionForm: FormGroup;

  ngOnInit() {
    this.generarColumnas();
    this.listarClasificaciones();
  }

  generarColumnas() {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      activo: {
        title: 'Estado'
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarClasificacion(row);
          });
        }
      }
    }
  }

  listarClasificaciones() {
    this.dataClasificacion.reset();
    this.clasificacionService.listarClasificacionesAll().subscribe(
      clasificaciones => {
        this.clasificaciones = clasificaciones;
        let dataClasificacion = [];
        clasificaciones.forEach(
          clasificacion => {
            dataClasificacion.push({
              id: clasificacion.id,
              nombre: clasificacion.nombre,
              activo: clasificacion.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataClasificacion.load(dataClasificacion);
      }
    )
    console.log(this.clasificaciones)
  }

  onAgregar() {
    this.agregarClasificacion();
  }

  agregarClasificacion() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarClasificacionComponent, {
      initialState: {
        titulo: 'Agregar Clasificación',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.clasificacionCreadaEvente.subscribe(() =>
      this.listarClasificaciones()
    )
  }

  modificarClasificacion(row) {
    this.clasificacion = this.clasificaciones.find(clasificacion => clasificacion.id == row.id)

    let bsModalRef: BsModalRef = this.modalService.show(ModificarClasificacionComponent, {
      initialState: {
        id: this.clasificacion.id,
        clasificacion: this.clasificacion,
        titulo: 'Modificar Clasificación'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.clasificacionModificadaEvent.subscribe(() => {
      this.clasificacionService.modificarClasificacion(this.clasificacion.id, this.clasificacion).subscribe(
        () => {
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se modificó la clasificación correctamente"
            }
          });
          this.listarClasificaciones();
        },
        error => {

        }
      )
    });
  }



}
