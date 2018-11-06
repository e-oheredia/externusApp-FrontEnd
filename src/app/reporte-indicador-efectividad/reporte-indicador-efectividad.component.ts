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
  graficoEfectividad: any[] = [];
  documentos: Documento[] = [];
  mesesConsulta: any[] = [];

  meses = [];
  tablaEfectividad = [];
  arrayTablaEfectividad = [];

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

  Porcentaje(cantidad: number, total: number): string {
    let resultado = (cantidad * 100) / total;
    if (isNaN(resultado)) {
      resultado = 0;
    }

    var final = resultado.toFixed(1) + '%';
    return final;

  }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {

    let fi = new Date(new Date(fechaIni).getTimezoneOffset() * 60 * 1000 + new Date(fechaIni).getTime());
    let ff = new Date(new Date(fechaFin).getTimezoneOffset() * 60 * 1000 + new Date(fechaFin).getTime());
    let fechaInicial = new Date(moment(new Date(fi.getFullYear(), fi.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
    let fechaFinal = new Date(moment(new Date(ff.getFullYear(), ff.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));

    let aIni = fechaInicial.getFullYear();
    let mIni = fechaInicial.getMonth();
    let aFin = fechaFinal.getFullYear();
    let mFin = fechaFinal.getMonth();

    console.log((aFin - aIni) * 12 + (mFin - mIni));

    if ((aFin - aIni) * 12 + (mFin - mIni) >= 13) {
      this.notifier.notify('error', 'SELECCIONE COMO MÁXIMO UN PERIODO DE 13 MESES');
      return;
    }



    if (!this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) && !this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {
      let fechaIniDate = new Date(fechaIni);
      let fechaFinDate = new Date(fechaFin);
      fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
      fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());


      //this.mesesConsulta = this.getMesesConsulta(fechaIniDate, fechaFinDate)

      this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoDocumentoEnum.ENVIADO).subscribe(
        documentos => {

          this.tablaEfectividad = []
          this.graficoEfectividad = [];
          this.meses = [];
          this.arrayTablaEfectividad = [];

          let ii = 1;

          while ((fechaFinDate.getFullYear() - fechaIniDate.getFullYear()) * 12 + (fechaFinDate.getMonth() - fechaIniDate.getMonth()) >= 0) {


            this.proveedores.forEach(

              proveedor => {


                let registroTablaEfectividad = {
                  proveedor: "", estado: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
                  cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", estilo: ""

                }

                let cantidadPorProveedor = documentos.filter(documento => {
                  return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                    (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO || this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO)
                }
                ).length;

                let totalMes = documentos.filter(documento => {
                  return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()

                }
                ).length;

                if (ii == 1) {

                  registroTablaEfectividad.proveedor = proveedor.nombre;
                  registroTablaEfectividad.estado = proveedor.nombre;
                  registroTablaEfectividad.cantidad01 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  registroTablaEfectividad.estilo = "proveedor";

                  this.tablaEfectividad.push(registroTablaEfectividad);

                }
                else {

                  if (ii == 2) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad02 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 3) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad03 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 4) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad04 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 5) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad05 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 6) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad06 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 7) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad07 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 8) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad08 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 9) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad09 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 10) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad10 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 11) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad11 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 12) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad12 = this.Porcentaje(cantidadPorProveedor, totalMes);
                  if (ii == 13) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad13 = this.Porcentaje(cantidadPorProveedor, totalMes);

                }



                this.estadosDocumento.forEach(


                  estadoDocumento => {


                    let registroTablaEfectividadEstado = {
                      proveedor: "", estado: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
                      cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", estilo: ""

                    }

                    let cantidadPorProveedorEstado = documentos.filter(documento => {
                      return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                        this.documentoService.getUltimoEstado(documento).id === estadoDocumento.id
                    }
                    ).length;




                    if (ii == 1) {

                      registroTablaEfectividadEstado.proveedor = proveedor.nombre;
                      registroTablaEfectividadEstado.estado = estadoDocumento.nombre;
                      registroTablaEfectividadEstado.cantidad01 = cantidadPorProveedorEstado.toString();
                      registroTablaEfectividadEstado.estilo = "";

                      this.tablaEfectividad.push(registroTablaEfectividadEstado);

                    }
                    else {

                      if (ii == 2) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad02 = cantidadPorProveedorEstado.toString();
                      if (ii == 3) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad03 = cantidadPorProveedorEstado.toString();
                      if (ii == 4) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad04 = cantidadPorProveedorEstado.toString();
                      if (ii == 5) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad05 = cantidadPorProveedorEstado.toString();
                      if (ii == 6) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad06 = cantidadPorProveedorEstado.toString();
                      if (ii == 7) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad07 = cantidadPorProveedorEstado.toString();
                      if (ii == 8) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad08 = cantidadPorProveedorEstado.toString();
                      if (ii == 9) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad09 = cantidadPorProveedorEstado.toString();
                      if (ii == 10) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad10 = cantidadPorProveedorEstado.toString();
                      if (ii == 11) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad11 = cantidadPorProveedorEstado.toString();
                      if (ii == 12) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad12 = cantidadPorProveedorEstado.toString();
                      if (ii == 13) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad13 = cantidadPorProveedorEstado.toString();

                    }


                  }

                )


              }



            )

            let registroGrafico = {
              mes: "",
              cantidad: "0"
            };



            let efectividad_mes = documentos.filter(documento => {
              return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO || this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
            }
            ).length;

            let totales_mes = documentos.filter(documento => {
              return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
            }
            ).length;


            registroGrafico.mes = this.utilsService.getNombreMes(fechaIniDate);
            registroGrafico.cantidad = this.Porcentaje(efectividad_mes, totales_mes);

            this.graficoEfectividad.push(registroGrafico);


            let mes = {
              id: 0,
              nombre: ""
            }
            mes.id = ii;
            mes.nombre = this.utilsService.getNombreMes(fechaIniDate);
            this.meses.push(mes);


            ii++;
            mIni++;
            if (mIni >= 13) {
              fechaIniDate = new Date(moment(new Date(fechaIniDate.getFullYear() + 1, 0, 1), "DD-MM-YYYY HH:mm:ss"));
            }
            else {
              fechaIniDate.setMonth(mIni);
            }

            aIni = fechaIniDate.getFullYear();
            mIni = fechaIniDate.getMonth();

          }


          this.arrayTablaEfectividad = this.tablaEfectividad.map(function (obj) {
            return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.estilo];
          });

          console.log(this.arrayTablaEfectividad);

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

  // llenarGraficoEficacia(documentos: Documento[], mesesConsulta: any[] = []) {
  //   this.graficoEficacia = [];
  //   mesesConsulta.forEach(mesConsulta => {
  // console.log(documentos.filter(documento => {

  //   return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO ||
  //     this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
  //     moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //     moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  // }).length);

  // console.log(documentos.filter(documento => {
  //   return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //     moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  // }).length === 0 ? 1 : documentos.filter(documento => {
  //   return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //     moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  // }).length);
  //     let graficoEficaciaObject = {
  //       mes: moment(('0' + mesConsulta.month).substring(1), 'MM').locale('es').format('MMMM').toUpperCase(),
  //       porcentaje: (documentos.filter(documento => {

  //         return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO ||
  //           this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
  //           moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //           moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  //       }).length / (documentos.filter(documento => {
  //         return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //           moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  //       }).length === 0 ? 1 : documentos.filter(documento => {
  //         return moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mesConsulta.month &&
  //           moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mesConsulta.year
  //       }).length)) * 100
  //     };
  //     this.graficoEficacia.push(graficoEficaciaObject);
  //   });
  //   console.log(this.graficoEficacia);
  // }

  getAxis = {
    dataField: 'mes',
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
  };


  getValueAxis = {
    title: { text: 'Porcentaje de Entregados' },
    tickMarks: { color: '#BCBCBC' },
    labels: { horizontalAlignment: 'right' },
    minValue: 0,
    maxValue: 100,
    unitInterval: 20
  }


  getSeriesGroups = [
    {
      type: 'line',
      orientation: 'vertical',
      series: [{
        dataField: 'cantidad',
        displayText: 'Porcentaje'
      }],
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
    }
  ]


  // getMesesConsulta(fechaIni: Date, fechaFin: Date) {
  //   fechaIni = new Date(fechaIni.getTimezoneOffset() * 60 * 1000 + fechaIni.getTime());
  //   fechaFin = new Date(fechaFin.getTimezoneOffset() * 60 * 1000 + fechaFin.getTime());
  //   let startMonth = fechaIni.getMonth();
  //   let finalMonth = fechaFin.getMonth();
  //   let startYear = fechaIni.getFullYear();
  //   let finalYear = fechaFin.getFullYear();
  //   let meses = [];
  //   for (let i = startYear; i <= finalYear; i++) {
  //     for (let j = startMonth; j <= (i === finalYear ? finalMonth : 11); j++) {
  //       meses.push({
  //         month: j + 1,
  //         year: i
  //       });
  //     }
  //     startMonth = 0;
  //   }
  //   return meses;
  // }

  // getPorcentajePorProveedorYMes(mes, proveedorId) {
  //   return this.documentos.filter(documento => {
  //     return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO ||
  //       this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
  //       documento.documentosGuia[0].guia.proveedor.id === proveedorId &&
  //       moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mes.month &&
  //       moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mes.year
  //   }).length / (this.documentos.filter(documento => {
  //     return documento.documentosGuia[0].guia.proveedor.id === proveedorId &&
  //       moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mes.month &&
  //       moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mes.year
  //   }).length === 0 ? 1 : this.documentos.filter(documento => {
  //     return documento.documentosGuia[0].guia.proveedor.id === proveedorId && moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mes.month &&
  //       moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mes.year
  //   }).length) * 100
  // }

  // getCantidadPorProveedorMesYEstado(estadoDocumentoId, mes, proveedorId) {
  //   return this.documentos.filter(documento => this.documentoService.getUltimoEstado(documento).id === estadoDocumentoId && moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").month() + 1 === mes.month && moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss").year() === mes.year && documento.documentosGuia[0].guia.proveedor.id === proveedorId).length
  // }


}
