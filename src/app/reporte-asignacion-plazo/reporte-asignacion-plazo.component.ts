import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from '../../../node_modules/angular-notifier';
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from '../../../node_modules/ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Subscription } from '../../../node_modules/rxjs';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import * as moment from "moment-timezone";
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { ReporteAsignacionPlazo } from 'src/model/reporteasignacionplazo.model';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@Component({
  selector: 'app-reporte-asignacion-plazo',
  templateUrl: './reporte-asignacion-plazo.component.html',
  styleUrls: ['./reporte-asignacion-plazo.component.css']
})
export class ReporteAsignacionPlazoComponent implements OnInit {

  constructor(
    private plazoService: PlazoDistribucionService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService
  ) { }

  dataAsignaciones: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  rutaManual: string = AppSettings.MANUAL_REGISTRO;

  reportesAsignacion: ReporteAsignacionPlazo[] = [];

  plazoSubscription: Subscription;
  plazoForm: FormGroup;


  ngOnInit() {
    this.plazoForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    }),
      this.tituloService.setTitulo("REPORTE DE ASIGNACIÓN DE PLAZOS");
    this.settings.hideSubHeader = false;
    this.generarColumnas();
    this.listarAsignacionesDePlazos();
  }

  generarColumnas() {
    this.settings.columns = {
      tipo: {
        title: 'Tipo de Asignación'
      },
      barea: {
        title: 'Buzón/Área'
      },
      plazo: {
        title: 'Plazo actual'
      },
      fechaCambio: {
        title: 'Fecha de cambio'
      },
      buttonDescargarPermiso: {
        title: 'Autorización',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.mostrarData.subscribe(row => {
            let asignacion = this.reportesAsignacion.find(asignacion => asignacion.id == row.id)
            instance.ruta = asignacion.rutaAutorizacion
          });
        }
      }
    }
  }


  listarAsignacionesDePlazos() {

    this.reportesAsignacion = [];

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.plazoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.plazoForm.controls['fechaFin'].value)) {
      this.plazoSubscription = this.plazoService.listarReporteAsignacionPlazos(this.plazoForm.controls['fechaIni'].value, this.plazoForm.controls['fechaFin'].value).subscribe(
        reportesAsignacion => {
          this.dataAsignaciones.reset();
          let dataAsignaciones = [];
          if (!this.utilsService.isUndefinedOrNullOrEmpty(reportesAsignacion)) {
            this.reportesAsignacion = reportesAsignacion
            reportesAsignacion.forEach(
              asignacion => {
                dataAsignaciones.push({
                  id: asignacion.id,
                  tipo: asignacion.tipoAsignacion,
                  barea: asignacion.areaBuzon,
                  plazo: asignacion.plazoActual,
                  fechaCambio: asignacion.fecha
                })
              }
            )
          }
          this.dataAsignaciones.load(dataAsignaciones);
        },
        error => {
          if (error.status === 400) {
            this.reportesAsignacion = [];
            this.notifier.notify('error', 'El rango de fechas es incorrecto');
          }
        }
      )
    }
    else {
      this.notifier.notify('error', 'Debe ingresar un rango de fechas');
    }
  }


  exportar() {
    this.plazoService.exportarAutorizaciones(this.dataAsignaciones);
  }


}
