import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../shared/documento.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { EnvioService } from '../shared/envio.service';
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Documento } from 'src/model/documento.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GuiaService } from '../shared/guia.service';
import { Guia } from 'src/model/guia.model';

@Component({
  selector: 'app-reporte-guias',
  templateUrl: './reporte-guias.component.html',
  styleUrls: ['./reporte-guias.component.css']
})

export class ReporteGuiasComponent implements OnInit {

  constructor(
    public guiaService: GuiaService,
    // public documentoService: DocumentoService,
    public envioService: EnvioService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService) { }


  dataGuias: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;

  guias: Guia[] = [];
  guia: Guia;
  // documentos: Documento[] = [];
  // documento: Documento;

  guiaSubscription: Subscription;
  guiaForm: FormGroup;

  ngOnInit() {
    this.guiaForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "codigo": new FormControl('', Validators.required)
    })
    this.tituloService.setTitulo("HISTORIAL DE GUIAS");
    this.settings.hideSubHeader = false;
    this.generarColumnas();
    this.listarGuias();
  }

  generarColumnas() {
    this.settings.columns = {
      numero: {
        title: 'Número de guía'
      },
      proveedor: {
        title: 'Proveedor'
      },
      plazo: {
        title: 'Plazo distribución'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      tipoSeguridad: {
        title: 'Tipo de seguridad'
      },
      sede: {
        title: 'Sede'
      },
      totalDocumentos: {
        title: 'Total de documentos'
      },
      fechaEnvio: {
        title: 'Fecha envío'
      },
      fechaUltimoEstado: {
        title: 'Fecha último estado'
      },
      estado: {
        title: 'Estado'
      }
    }
  }

  listarGuias() {
    if (this.guiaForm.controls['codigo'].value.length !== 0) {

      this.guiaSubscription = this.guiaService.listarGuiaPorCodigo(this.guiaForm.controls['codigo'].value)
        .subscribe(
          guia => {
            this.guias = []
            this.guias.push(guia)
            let dataGuias = [];
            dataGuias.push({
              numero: guia.numeroGuia,
              proveedor: guia.proveedor.nombre,
              plazo: guia.plazoDistribucion.nombre,
              tipoServicio: guia.tipoServicio.nombre,
              tipoSeguridad: guia.tipoSeguridad.nombre,
              sede: guia.sede.nombre,
              totalDocumentos: "AUN FALTA CODIGO",
              fechaEnvio: this.guiaService.getFechaEnvio(guia),
              fechaUltimoEstado: this.guiaService.getFechaUltimoEstadoGuia(guia),
              estado: this.guiaService.getEstadoGuia(guia).nombre
            })
            this.guias.push(guia);
            this.dataGuias.load(dataGuias);
            this.guiaForm.controls['codigo'].reset();
            this.guiaForm.controls['fechaIni'].reset();
            this.guiaForm.controls['fechaFin'].reset();
            this.guiaForm.controls['fechaIni'].enable();
            this.guiaForm.controls['fechaFin'].enable();
            this.notifier.notify('success', 'GUIA ENCONTRADA');
          },
          error => {
            if (error.status === 400) {
              this.guias = [];
              this.notifier.notify('error', 'NO HAY RESULTADOS');
            }
          }
        );
    }

    else if (!this.utilsService.isUndefinedOrNullOrEmpty(this.guiaForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.guiaForm.controls['fechaFin'].value)) {

      this.guiaSubscription = this.guiaService.listarGuiasPorFechas(this.guiaForm.controls['fechaIni'].value, this.guiaForm.controls['fechaFin'].value)
        .subscribe(
          guias => {
            this.guias = guias
            this.guiaForm.controls['codigo'].enable();

            this.dataGuias.reset();
            this.guiaService.listarGuiasPorFechas(this.guiaForm.controls['fechaIni'].value, this.guiaForm.controls['fechaFin'].value).subscribe(
              guias => {
                this.guias = guias;
                let dataGuias = [];
                guias.forEach(
                  guia => {
                    dataGuias.push({
                      numero: guia.numeroGuia,
                      proveedor: guia.proveedor.nombre,
                      plazo: guia.plazoDistribucion.nombre,
                      tipoServicio: guia.tipoServicio.nombre,
                      tipoSeguridad: guia.tipoSeguridad.nombre,
                      sede: guia.sede.nombre,
                      totalDocumentos: guia.cantidadDocumentos,
                      fechaEnvio: this.guiaService.getFechaEnvio(guia),
                      fechaUltimoEstado: this.guiaService.getFechaUltimoEstadoGuia(guia),
                      estado: this.guiaService.getEstadoGuia(guia).nombre
                    })
                  }                  
                )
                this.dataGuias.load(dataGuias);
              }
            )
          },
          error => {
            if (error.status === 400) {
              this.guias = [];
              this.notifier.notify('error', 'EL RANGO DE FECHAS ES INCORRECTO');
            }
          }
        );
    }

    else {
      this.notifier.notify('error', 'DEBE INGRESAR EL CÓDIGO O UN RANGO DE FECHAS');
    }
  }



  desactivarFechas(codigo) {
    if (codigo.length === 0) {
      this.guiaForm.controls['fechaIni'].enable();
      this.guiaForm.controls['fechaFin'].enable();
    } else {
      this.guiaForm.controls['fechaIni'].disable();
      this.guiaForm.controls['fechaFin'].disable();
    }
  }


}
