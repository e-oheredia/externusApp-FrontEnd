import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { TipoSeguridadService } from 'src/app/shared/tiposeguridad.service';
import { TipoSeguridad } from 'src/model/tiposeguridad.model';
import { AgregarTipoSeguridadComponent } from './agregar-tipo-seguridad/agregar-tipo-seguridad.component';
import { ModificarTipoSeguridadComponent } from './modificar-tipo-seguridad/modificar-tipo-seguridad.component';

@Component({
  selector: 'app-tipo-seguridad',
  templateUrl: './tipo-seguridad.component.html',
  styleUrls: ['./tipo-seguridad.component.css']
})
export class TipoSeguridadComponent implements OnInit {

  constructor(
    public tipoSeguridadService: TipoSeguridadService,
    private modalService: BsModalService,
    private tituloService: TituloService
  ) { }

  dataTipoSeguridad : LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  tiposSeguridad: TipoSeguridad[] = [];
  tipoSeguridad: TipoSeguridad;

  tipoSeguridadSubscription: Subscription;
  tipoSeguridadForm: FormGroup;

  ngOnInit() {
    this.tituloService.setTitulo("Mantenimiento de tipo de seguridad");
    this.generarColumnas();
    this.listarTiposSeguridad();
  }

  generarColumnas(){
    this.settings.columns = {
      id : {
        title : 'ID'
      },
      nombre : {
        title : 'Nombre'
      },
      activo : {
        title : 'Estado'
      },
      buttonModificar: {
        title : 'Modificar',
        type : 'custom',
        renderComponent : ButtonViewComponent,
        onComponentInitFunction : (instance : any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarTipoSeguridad(row);
          });
        }
      }
    }
  }


    listarTiposSeguridad(){
    this.dataTipoSeguridad.reset();
    this.tipoSeguridadService.listarTiposSeguridad().subscribe(
      tiposSeguridad => {
        this.tiposSeguridad = tiposSeguridad;
        let dataTipoSeguridad = [];
        tiposSeguridad.forEach(
          tipoSeguridad => {
            dataTipoSeguridad.push({
              id: tipoSeguridad.id,
              nombre: tipoSeguridad.nombre,
              activo: tipoSeguridad.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataTipoSeguridad.load(dataTipoSeguridad);
      }
    )
  }

  onAgregar(){
    this.agregarTipoSeguridad();
  }

  agregarTipoSeguridad(){
    let bsModalRef: BsModalRef = this.modalService.show(AgregarTipoSeguridadComponent, {
      initialState : {
        titulo: 'Agregar Tipo de Seguridad',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.tipoSeguridadCreadoEvent.subscribe(() => 
    this.listarTiposSeguridad()
    )
  }

  
  modificarTipoSeguridad(row){
    this.tipoSeguridad = this.tiposSeguridad.find(tipoSeguridad => tipoSeguridad.id == row.id)
  
    let bsModalRef: BsModalRef = this.modalService.show(ModificarTipoSeguridadComponent, {
      initialState: {
        id: this.tipoSeguridad.id,
        tipoSeguridad: this.tipoSeguridad,
        titulo: 'Modificar Tipo de Seguridad'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.tipoSeguridadService.modificarTipoSeguridad(this.tipoSeguridad.id,this.tipoSeguridad).subscribe(
        () => {
          let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
            initialState: {
              mensaje: "Se modificó el tipo de seguridad correctamente"
            }
          });
          this.listarTiposSeguridad();
        },
        error => {

        }
      )
    });
  }



}
