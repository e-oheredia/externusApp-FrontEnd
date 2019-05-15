import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../shared/envio.service';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Envio } from 'src/model/envio.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@Component({
  selector: 'app-reporte-inconsistencia',
  templateUrl: './reporte-inconsistencia.component.html',
  styleUrls: ['./reporte-inconsistencia.component.css']
})
export class ReporteInconsistenciaComponent implements OnInit {

  constructor(
    public envioService: EnvioService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService
  ) { }

  dataEnvios: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;

  envio: Envio;
  envios: Envio[] = [];

  envioSubscription: Subscription;
  envioForm: FormGroup;

  ngOnInit() {
    this.envioForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required)
    })
    this.tituloService.setTitulo("Reporte de inconsistencias");
    this.generarColumnas();
    // this.listarEnvios();
  }

  generarColumnas(){
    this.settings.columns = {
      remitente: {
        title: 'Remitente'
      },
      area: {
        title: 'Área remitente'
      },
      tipoUsuario: {
        title: 'Tipo de usuario'
      },
      plazo: {
        title: 'Plazo de distribución'
      },
      fechaCreacion: {
        title: 'Fecha de creación'
      },
      descargar: {
        title: 'Descargar inconsistencias',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            // this.descargar(row);
          });
        }
      }
    }
  }

  // descargar(row){
  //   let envio = this.envios.find(envio => envio.id === row.id)
  //   this.envioService.listarEnviosConInconsistencias().subscribe(
  //     envios => {
  //       this.envioService.exportarInconsistenciasEnvio(envios.id)
  //       if()
  //     }
  //   )
  // }

}
