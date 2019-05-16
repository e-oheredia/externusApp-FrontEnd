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
import { EnvioMasivo } from 'src/model/enviomasivo.model';

@Component({
  selector: 'app-reporte-autorizacion',
  templateUrl: './reporte-autorizacion.component.html',
  styleUrls: ['./reporte-autorizacion.component.css']
})
export class ReporteAutorizacionComponent implements OnInit {

  constructor(
    public envioService: EnvioService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService
  ) { }

  dataEnvios: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  rutaManual: string = AppSettings.MANUAL_REGISTRO;

  envios: Envio[] = [];
  envio: Envio;

  envioSubscription: Subscription;
  envioForm: FormGroup;

  ngOnInit() {
    this.envioForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    })
    this.tituloService.setTitulo("REPORTE DE AUTORIZACIONES");
    this.settings.hideSubHeader = false;
    this.generarColumnas();
    this.listarAutorizaciones();

  }

  generarColumnas() {
    this.settings.columns = {
      area: {
        title: 'Área'
      },
      nombreUsuario: {
        title: 'Nombre de usuario'
      },
      autogenerado: {
        title: 'Autogenerado'
      },
      producto: {
        title: 'Producto'
      },
      plazoDistribucion: {
        title: 'Plazo de distribución'
      },
      cantidadDocumentos: {
        title: 'Cantidad de documentos'
      },
      autorizacion: {
        title: 'Estado autorización'
      },
      usuarioAutorizador: {
        title: 'Usuario autorizador'
      },
      fechaAutorizacion: {
        title: 'Fecha respuesta '
      }
    }
  }

  listarAutorizaciones() {
    this.envios = [];
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaFin'].value)) {
      this.envioSubscription = this.envioService.listarEnviosParaAutorizarPorFechas(this.envioForm.controls['fechaIni'].value, this.envioForm.controls['fechaFin'].value).subscribe(
        envios => {          
          this.dataEnvios.reset();
          let dataEnvios = [];
          if (!this.utilsService.isUndefinedOrNullOrEmpty(envios)){
            this.envios = envios
            envios.forEach(
              envio => {
                dataEnvios.push({
                  id: envio.id,
                  area: envio.buzon.area.nombre,
                  nombreUsuario: envio.buzon.nombre,
                  autogenerado: this.envioService.getAutogeneradoEnvio(envio),
                  producto: envio.producto.nombre,
                  plazoDistribucion: envio.plazoDistribucion.nombre,
                  cantidadDocumentos: envio.documentos ? envio.documentos.length : 'no hay',
                  autorizacion: this.envioService.getUltimoSeguimientoAutorizacion(envio) ? this.envioService.getUltimoSeguimientoAutorizacion(envio).estadoAutorizado.nombre : "APROBADA",
                  usuarioAutorizador: this.envioService.getAutorizador(envio),
                  fechaAutorizacion: this.envioService.getUltimaFechaEstadoAutorizacion(envio)
                })
              }
            )
          }
          this.dataEnvios.load(dataEnvios);
        }
      ),
        error => {
          if (error.status === 400) {
            this.envios = [];
            this.notifier.notify('error', 'El rango de fechas es incorrecto');
          }
        }
    }
    else {
      this.notifier.notify('error', 'Debe ingresar un rango de fechas');
    }
  }

  exportar() {
    this.envioService.exportarAutorizaciones(this.envios)
  }

}
