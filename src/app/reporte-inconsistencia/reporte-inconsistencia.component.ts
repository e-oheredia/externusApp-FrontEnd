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
import { DocumentoService } from '../shared/documento.service';
import { InconsistenciaDocumento } from 'src/model/inconsistenciadocumento.model';

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
    private tituloService: TituloService,
    public documentoService: DocumentoService
  ) { }

  dataEnviosConIncidencias: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;

  envios: Envio[] = [];
  inconsistencias: InconsistenciaDocumento[] = [];
  enviosSubscription: Subscription;
  envioForm: FormGroup;

  ngOnInit() {
    this.envioForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required)
    })
    this.settings.hideSubHeader = false;
    this.tituloService.setTitulo("Reporte de inconsistencias");
    this.generarColumnas();
    this.listarEnviosConInconsistencias();

  }

  generarColumnas() {
    this.settings.columns = {
      remitente: {
        title: 'Remitente'
      },
      areaRemitente: {
        title: 'Área remitente'
      },
      tipoEnvio: {
        title: 'Tipo de envío'
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
            this.descargar(row);
          });
        }
      }
    }
  }

  descargar(row) {
    let envio = this.envios.find(envio => envio.id === row.id)
    this.envioService.listarEnviosConInconsistenciasPorEnvioId(envio.id).subscribe(
      inconsistencias => {
        this.inconsistencias = inconsistencias;
        this.envioService.descargarInconsistenciasEnvio(inconsistencias, envio)
      }
    )
  }

  listarEnviosConInconsistencias() {
    this.envios = [];
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaFin'].value)) {
      this.enviosSubscription = this.envioService.listarEnviosConInconsistenciasPorFechas(this.envioForm.controls['fechaIni'].value, this.envioForm.controls['fechaFin'].value).subscribe(
        envios => {
          this.dataEnviosConIncidencias.reset();
          let dataEnviosConIncidencias = [];
          if (!this.utilsService.isUndefinedOrNullOrEmpty(envios)) {
            this.envios = envios;
            envios.forEach(
              envio => {
                dataEnviosConIncidencias.push({
                  id: envio.id,
                  remitente: envio.buzon.nombre,
                  areaRemitente: envio.buzon.area.nombre,
                  tipoEnvio: envio.tipoEnvio.nombre,
                  plazo: envio.plazoDistribucion.nombre,
                  fechaCreacion: this.documentoService.getFechaCreacion(envio.documentos[0])
                })
              }
            )
          }
          this.dataEnviosConIncidencias.load(dataEnviosConIncidencias);
        },
        error => {
          if (error.status === 400) {
            this.envios = [];
            this.notifier.notify('error', error.error);
          }
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el código o un rango de fechas');
    }
  }

  exportar() {
    // this.documentoService.exportarInconsistenciasMasivoyBloque(this.envios);
  }


}
