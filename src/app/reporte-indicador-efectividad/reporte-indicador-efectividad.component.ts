import { Documento } from 'src/model/documento.model';
import { EstadoDocumento } from './../../model/estadodocumento.model';
import { EstadoDocumentoEnum } from './../enum/estadodocumento.enum';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { DocumentoService } from './../shared/documento.service';
import { UtilsService } from './../shared/utils.service';
import { Proveedor } from './../../model/proveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../shared/proveedor.service';
import * as moment from "moment-timezone";
import 'moment/min/locales';
import { EstadoDocumentoService } from '../shared/estadodocumento.service';

@Component({
  selector: 'app-reporte-indicador-efectividad',
  templateUrl: './reporte-indicador-efectividad.component.html',
  styleUrls: ['./reporte-indicador-efectividad.component.css']
})
export class ReporteIndicadorEfectividadComponent implements OnInit {

  constructor(
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private estadoDocumentoService: EstadoDocumentoService,
    private notifier: NotifierService
  ) { }

  busquedaForm: FormGroup;
  proveedores: Proveedor[];
  documentosSubscription: Subscription = new Subscription();
  estadosDocumento: EstadoDocumento[];
  graficoEficacia: any[] = [];
  documentos: Documento[] = [];
  mesesConsulta: any[] = [];

  ngOnInit() {
    this.busquedaForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });
    this.proveedores = this.proveedorService.getProveedores();
    this.proveedorService.proveedoresChanged.subscribe(proveedores => this.proveedores = proveedores);
    this.estadosDocumento = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor();
    this.estadosDocumento.push({
      id: 3,
      nombre: 'PENDIENTE DE ENTREGA'
    });
    this.estadoDocumentoService.estadosDocumentoResultadosProveedorChanged.subscribe(estadosDocumento => {
      this.estadosDocumento = estadosDocumento;
      this.estadosDocumento.push({
        id: 3,
        nombre: 'PENDIENTE DE ENTREGA'
      });
    });
  }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {

    if (!this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) && !this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {
      let fechaIniDate = new Date(fechaIni);
      let fechaFinDate = new Date(fechaFin);
      this.mesesConsulta = this.getMesesConsulta(fechaIniDate, fechaFinDate)
      this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth() + 1, 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoDocumentoEnum.ENVIADO).subscribe(
        documentos => {
          this.documentos = documentos;
          this.llenarGraficoEficacia(documentos, this.mesesConsulta);
        },
        error => {
          if (error.status === 400) {
            this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
          }
        }
      );
    }
    else {
      this.notifier.notify('error', 'SELECCIONE RANGO DE FECHAS');
    }
  }

  llenarGraficoEficacia(documentos: Documento[], mesesConsulta: any[] = []) {
    this.graficoEficacia = [];
    mesesConsulta.forEach(mesConsulta => {
      let graficoEficaciaObject = {
        mes: moment(('0' + mesConsulta.month).substring(1), 'MM').locale('es').format('MMMM').toUpperCase(),
        porcentaje: (documentos.filter(documento => {
          console.log(this.documentoService.getUltimoEstado(documento).id);
          return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO ||
            this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
        }).length / (documentos.filter(documento => {
          return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
        }).length === 0 ? 1 : documentos.filter(documento => {
          return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
        }).length)) * 100
      };
      this.graficoEficacia.push(graficoEficaciaObject);
    });
    console.log(this.graficoEficacia);
  }

  getAxis(dataField: string) {
    return {
      dataField: dataField,
      unitInterval: 1,
      axisSize: 'auto',
      tickMarks: {
        visible: false,
        interval: 1
      },
      gridLines: {
        visible: false,
        interval: 1
      },
      valuesOnTicks: false,
      padding: { bottom: 10 }
    }
  }

  getValueAxis(title: string) {
    return {
      title: { text: title },
      tickMarks: { color: '#BCBCBC' },
      labels: { horizontalAlignment: 'right' },
      minValue: 0,
      maxValue: 100,
      unitInterval: 20
    }
  }

  getSeriesGroups(type: string, datas: any[], orientation = 'vertical') {
    let series: any[] = [];
    datas.forEach(data => {
      let keys: string[] = Object.keys(data);
      if (keys.length == 1) {
        series.push({
          dataField: keys[0],
          displayText: data[keys[0]],
          symbolType: 'square',
          labels:
          {
            visible: true,
            backgroundColor: '#FEFEFE',
            backgroundOpacity: 0.2,
            borderColor: '#7FC4EF',
            borderOpacity: 0.7,
            padding: { left: 5, right: 5, top: 0, bottom: 0 }
          }
        })
      } else {
        series.push({
          dataField: keys[0],
          displayText: data[keys[0]],
          colorFunction: (value, itemIndex) => {
            if (data['indiceReporte'] < itemIndex) {
              return '#fff655';
            }
            return '#55CC55';
          }
        })
      }
    });


    return [
      {
        type: type,
        orientation: orientation,
        series: series
      }
    ]
  }

  getMesesConsulta(fechaIni: Date, fechaFin: Date) {
    fechaIni = new Date(fechaIni.getTimezoneOffset() * 60 * 1000 + fechaIni.getTime());
    fechaFin = new Date(fechaFin.getTimezoneOffset() * 60 * 1000 + fechaFin.getTime());
    let startMonth = fechaIni.getMonth();
    let finalMonth = fechaFin.getMonth();
    let startYear = fechaIni.getFullYear();
    let finalYear = fechaFin.getFullYear();
    let meses = [];
    for (let i = startYear; i <= finalYear; i++) {
      for (let j = startMonth; j <= (i === finalYear ? finalMonth : 11); j++) {
        meses.push({
          month: j + 1,
          year: i
        });
      }
      startMonth = 0;
    }
    return meses;
  }

  getCantidadPorProveedorMesYEstado(estadoDocumentoId, mes, proveedorId) {
    return this.documentos.filter(documento => this.documentoService.getUltimoEstado(documento).id === estadoDocumentoId && moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mes.month && moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mes.year && documento.documentosGuia[0].guia.proveedor.id === proveedorId).length
  }


}
