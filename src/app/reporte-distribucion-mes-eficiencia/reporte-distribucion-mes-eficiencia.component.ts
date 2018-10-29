import { PlazoDistribucion } from './../../model/plazodistribucion.model';
import { PlazoDistribucionService } from './../shared/plazodistribucion.service';
import { Documento } from './../../model/documento.model';
import { EstadoDocumentoEnum } from './../enum/estadodocumento.enum';
import { NotifierService } from 'angular-notifier';
import { DocumentoService } from './../shared/documento.service';
import { Subscription } from 'rxjs';
import { UtilsService } from './../shared/utils.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../shared/proveedor.service';
import { Proveedor } from '../../model/proveedor.model';
import * as moment from "moment-timezone";

@Component({
  selector: 'app-reporte-distribucion-mes-eficiencia',
  templateUrl: './reporte-distribucion-mes-eficiencia.component.html',
  styleUrls: ['./reporte-distribucion-mes-eficiencia.component.css']
})
export class ReporteDistribucionMesEficienciaComponent implements OnInit {

  constructor(
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private notifier: NotifierService,
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  busquedaForm: FormGroup;
  proveedores: Proveedor[] = [];
  eficienciaPorProveedor: any[] = [];
  reportesEficienciaPorPlazoDistribucion: any = {};
  reportesDetalleEficiencia: any = {};
  documentosSubscription: Subscription;
  proveedorElegidoDetalle: Proveedor;
  documentos: Documento[] = [];

  ngOnInit() {
    this.busquedaForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });
    this.proveedores = this.proveedorService.getProveedores();
    this.proveedorService.proveedoresChanged.subscribe(proveedores => this.proveedores = proveedores);
  }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaFin'].value)) {
      this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENTREGADO).subscribe(
        documentos => {
          this.documentos = documentos;
          this.llenarEficienciaPorProveedor(documentos);
          this.llenarEficienciaPorPlazoDistribucion(documentos);
          this.llenarDetalleEficiencia(documentos);
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

  getPorcentajeDentroPlazoPorProveedor(proveedor = { id: 0 }) {
    if (proveedor.id === 0) {
      return this.documentos.filter(documento => documento.envio.plazoDistribucion.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()).length / (this.documentos.length === 0 ? 1 : this.documentos.length) * 100;
    } else {
      return this.documentos.filter(documento =>
        documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
        documento.envio.plazoDistribucion.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
      ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length) * 100;
    }
  }

  getPorcentajeFueraPlazoPorProveedor(proveedor = { id: 0 }) {
    if (proveedor.id === 0) {
      return this.documentos.filter(documento => documento.envio.plazoDistribucion.tiempoEnvio <= moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()).length / (this.documentos.length === 0 ? 1 : this.documentos.length) * 100;
    } else {
      return this.documentos.filter(documento =>
        documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
        documento.envio.plazoDistribucion.tiempoEnvio <= moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
      ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length) * 100;
    }
  }

  llenarEficienciaPorProveedor(documentos: Documento[]) {
    this.eficienciaPorProveedor = [];
    this.proveedores.forEach(
      proveedor => {
        let eficienciaPorProveedorObjeto = {
          proveedor: "",
          dentroPlazo: 0,
          fueraPlazo: 0
        };
        eficienciaPorProveedorObjeto.proveedor = proveedor.nombre;
        eficienciaPorProveedorObjeto.dentroPlazo = documentos.filter(documento =>
          documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
          documento.envio.plazoDistribucion.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
        ).length;
        eficienciaPorProveedorObjeto.fueraPlazo = documentos.filter(documento => {
          return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.tiempoEnvio <= moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours();
        }).length;
        this.eficienciaPorProveedor.push(eficienciaPorProveedorObjeto);
      }
    )
  }

  llenarEficienciaPorPlazoDistribucion(documentos: Documento[]) {
    this.reportesEficienciaPorPlazoDistribucion = {};
    this.proveedores.forEach(
      proveedor => {
        let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];
        proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion => {
          let eficienciaPorPlazoDistribucionPorProveedorObjeto = {
            plazoDistribucion: plazoDistribucion.nombre,
            dentroPlazo: documentos.filter(documento =>
              documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
              documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
              documento.envio.plazoDistribucion.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
            ).length,
            fueraPlazo: documentos.filter(documento =>
              documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
              documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
              documento.envio.plazoDistribucion.tiempoEnvio <= moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
            ).length,
          }
          eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
        });
        this.reportesEficienciaPorPlazoDistribucion[proveedor.nombre] = eficienciaPorPlazoDistribucionPorProveedor;
      }
    )
  }

  getPorcentajeDentroPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    return this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id && documento.envio.plazoDistribucion.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
    ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length) * 100;
  }
  getPorcentajeFueraPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    return this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id && documento.envio.plazoDistribucion.tiempoEnvio <= moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
    ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length) * 100;
  }

  llenarDetalleEficiencia(documentos: Documento[]) {
    this.reportesDetalleEficiencia = {};
    let documentosAux: Documento[] = [];
    this.proveedores.forEach(
      proveedor => {
        proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion => {
          let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];
          proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion2 => {
            let eficienciaPorPlazoDistribucionPorProveedorObjeto = {
              plazoDistribucion: plazoDistribucion2.nombre,
              dentroPlazo: documentos.filter(documento => {
                if (documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                  documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                  plazoDistribucion2.tiempoEnvio > moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()) {
                  return true;
                }
                documentosAux.push(documento);
              }).length
            }
            documentos = documentosAux;
            documentosAux = [];
            eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
          });
          if (plazoDistribucion.id === 1) {
            eficienciaPorPlazoDistribucionPorProveedor.push({
              plazoDistribucion: 'Más de ' + plazoDistribucion.nombre,
              dentroPlazo: documentos.filter(documento =>
                documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                plazoDistribucion.tiempoEnvio < moment.duration(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"))).asHours()
              ).length
            });
          }
          this.reportesDetalleEficiencia[proveedor.nombre + '-' + plazoDistribucion.id] = eficienciaPorPlazoDistribucionPorProveedor;
        });
      }
    )
  }

  getAxis(dataField: string) {
    return {
      dataField: dataField,
      unitInterval: 1,
      axisSize: 'auto',
      flip: false,
      tickMarks: {
        visible: false,
        interval: 1,
        color: '#CACACA'
      },
      gridLines: {
        visible: false,
        interval: 1,
        color: '#BCBCBC'
      }
    }
  }

  getValueAxis(title: string) {
    return {
      title: { text: title },
      flip: true,
      tickMarks: { color: '#BCBCBC' },
      labels: { visible: true },
      minValue: 0,
      unitInterval: 1
    }
  }

  getSeriesGroups(type: string, datas: any[], orientation = 'vertical') {
    let series: any[] = [];
    datas.forEach(data => {
      let keys: string[] = Object.keys(data);
      if (keys.length == 1) {
        series.push({
          dataField: keys[0],
          displayText: data[keys[0]]
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
}
