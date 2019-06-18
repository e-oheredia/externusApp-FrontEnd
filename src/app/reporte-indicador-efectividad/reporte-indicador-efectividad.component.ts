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
import { ReporteService } from '../shared/reporte.service';

@Component({
  selector: 'app-reporte-indicador-efectividad',
  templateUrl: './reporte-indicador-efectividad.component.html',
  styleUrls: ['./reporte-indicador-efectividad.component.css']
})
export class ReporteIndicadorEficaciaComponent implements OnInit {

  constructor(
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private reporteService: ReporteService,
    private estadoDocumentoService: EstadoDocumentoService,
    private notifier: NotifierService
  ) { }

  dataSource = [];
  estadosDocumento: EstadoDocumento[];
  proveedores: Proveedor[];
  documentosSubscription: Subscription;
  busquedaForm: FormGroup;
  // documentosSubscription: Subscription = new Subscription();
  validacion: number;

  data: any[] = [];
  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];

  meses = [];
  graficoEfectividad: any[] = [];
  tablaEfectividad = [];
  arrayTablaEfectividad = [];

  ngOnInit() {
    this.validacion = 0
    this.busquedaForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });

    this.proveedores = this.proveedorService.getProveedores();
    this.proveedorService.proveedoresChanged.subscribe(proveedores => this.proveedores = proveedores);

    this.estadosDocumento = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor();
    this.estadosDocumento.push(
      {
        id: 3,
        nombre: 'PENDIENTE DE ENTREGA',
        estadosDocumentoPermitidos: [],
        motivos: [],
        tiposDevolucion: []
      },
      {
        id: 4,
        nombre: 'ENTREGADO',
        estadosDocumentoPermitidos: [],
        motivos: [],
        tiposDevolucion: []
      },
      {
        id: 5,
        nombre: 'REZAGADO',
        estadosDocumentoPermitidos: [],
        motivos: [],
        tiposDevolucion: []
      },
      {
        id: 6,
        nombre: 'NO DISTRIBUIBLE',
        estadosDocumentoPermitidos: [],
        motivos: [],
        tiposDevolucion: []
      }
    );
  }

  // Porcentaje(cantidad: number, total: number): string {
  //   let resultado = (cantidad * 100) / total;
  //   if (isNaN(resultado)) {
  //     resultado = 0;
  //   }

  //   var final = resultado.toFixed(1) + '%';
  //   return final;

  // }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {

    let fi = new Date(new Date(fechaIni).getTimezoneOffset() * 60 * 1000 + new Date(fechaIni).getTime());
    let ff = new Date(new Date(fechaFin).getTimezoneOffset() * 60 * 1000 + new Date(fechaFin).getTime());
    let fechaInicial = new Date(moment(new Date(fi.getFullYear(), fi.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
    let fechaFinal = new Date(moment(new Date(ff.getFullYear(), ff.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
    let aIni = fechaInicial.getFullYear();
    let mIni = fechaInicial.getMonth();
    let aFin = fechaFinal.getFullYear();
    let mFin = fechaFinal.getMonth();


    // if ((aFin - aIni) * 12 + (mFin - mIni) >= 13) {
    //   this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
    //   return;
    // }

    if (!this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) &&
      !this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {

      let fechaIniDate = new Date(fechaIni);
      let fechaFinDate = new Date(fechaFin);
      fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
      fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());

      // this.documentosSubscription = this.reporteService.getReporteIndicadorEficaciaGrafico(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoDocumentoEnum.ENVIADO).subscribe(
      this.documentosSubscription = this.reporteService.getReporteIndicadorEficaciaGrafico(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD')).subscribe(
        (data: any) => {
          this.validacion = 1;
          this.data = data;

          this.meses = [];
          this.graficoEfectividad = [];
          this.tablaEfectividad = [];
          this.arrayTablaEfectividad = [];

          // 
          Object.keys(data).forEach(key1 => {
            if (1 === parseInt(key1)) {
              var obj1 = data[key1];

              Object.keys(obj1).forEach(key2 => {
                var obj2 = obj1[key2];
                Object.keys(obj2).forEach(key3 => {
                  let registroGrafico = {
                    mes: "",
                    cantidad: "0"
                  };
                  registroGrafico.mes = this.utilsService.getNombreMes2(parseInt(key3));
                  let numero = obj2[key3] * 100;
                  let decimal = numero.toFixed(1)
                  let porcentaje = decimal + "%"
                  registroGrafico.cantidad = porcentaje
                  this.graficoEfectividad.push(registroGrafico);

                  let mes = {
                    id: 0,
                    nombre: ""
                  }
                  mes.id = parseInt(key3);
                  mes.nombre = this.utilsService.getNombreMes2(parseInt(key3));
                  this.meses.push(mes);
                });
              });
            }
          });


          Object.keys(data).forEach(key1 => {
            if (3 === parseInt(key1)) {
              this.proveedores.forEach(
                proveedor => {
                  let reporteFinal = {
                    proveedor: "", estado: "", cantidad01: "", cantidad02: "", cantidad03: "", cantidad04: "", cantidad05: "",
                    cantidad06: "", cantidad07: "", cantidad08: "", cantidad09: "", cantidad10: "", cantidad11: "", cantidad12: "", cantidad13: "", estilo: ""
                  }
                  reporteFinal.proveedor = proveedor.nombre;
                  reporteFinal.estado = proveedor.nombre;
                  var obj1 = data[key1];
                  Object.keys(obj1).forEach(key2 => {
                    var obj2 = obj1[key2];
                    if (proveedor.id == parseInt(key2)) {
                      Object.keys(obj2).forEach(key3 => {
                        var obj3 = obj2[key3];
                        Object.keys(obj3).forEach(key4 => {
                          let numero = obj3[key4] * 100;
                          let decimal = numero.toFixed(1);
                          let porcentaje = decimal + "%";
                          if (parseInt(key4) == 1) {
                            reporteFinal.cantidad01 = porcentaje;
                          }
                          if (parseInt(key4) == 2) {
                            reporteFinal.cantidad02 = porcentaje;
                          }
                          if (parseInt(key4) == 3) {
                            reporteFinal.cantidad03 = porcentaje;
                          }
                          if (parseInt(key4) == 4) {
                            reporteFinal.cantidad04 = porcentaje;
                          }
                          if (parseInt(key4) == 5) {
                            reporteFinal.cantidad05 = porcentaje;
                          }
                          if (parseInt(key4) == 6) {
                            reporteFinal.cantidad06 = porcentaje;
                          }
                          if (parseInt(key4) == 7) {
                            reporteFinal.cantidad07 = porcentaje;
                          }
                          if (parseInt(key4) == 8) {
                            reporteFinal.cantidad08 = porcentaje;
                          }
                          if (parseInt(key4) == 9) {
                            reporteFinal.cantidad09 = porcentaje;
                          }
                          if (parseInt(key4) == 10) {
                            reporteFinal.cantidad10 = porcentaje;
                          }
                          if (parseInt(key4) == 11) {
                            reporteFinal.cantidad11 = porcentaje;
                          }
                          if (parseInt(key4) == 12) {
                            reporteFinal.cantidad12 = porcentaje;
                          }
                          if (parseInt(key4) == 13) {
                            reporteFinal.cantidad13 = porcentaje;
                          }
                        });
                      });
                    }
                  });
                  reporteFinal.estilo = "proveedor";
                  this.tablaEfectividad.push(reporteFinal);
                  Object.keys(this.data).forEach(keyn1 => {
                    if (2 === parseInt(keyn1)) {
                      this.estadosDocumento.forEach(
                        estado => {
                          let reporteFinal = {
                            proveedor: "", estado: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                            cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, estilo: ""
                          }
                          reporteFinal.proveedor = proveedor.nombre;
                          reporteFinal.estado = estado.nombre;
                          var objn1 = this.data[keyn1];
                          Object.keys(objn1).forEach(keyn2 => {
                            if (proveedor.id == parseInt(keyn2)) {
                              var objn2 = objn1[keyn2];
                              Object.keys(objn2).forEach(keyn3 => {
                                var objn3 = objn2[keyn3];
                                if (estado.id == parseInt(keyn3)) {
                                  Object.keys(objn3).forEach(keyn4 => {
                                    var objn4 = objn3[keyn4];
                                    Object.keys(objn4).forEach(keyn5 => {
                                      if (parseInt(keyn5) == 1) {
                                        reporteFinal.cantidad01 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 2) {
                                        reporteFinal.cantidad02 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 3) {
                                        reporteFinal.cantidad03 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 4) {
                                        reporteFinal.cantidad04 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 5) {
                                        reporteFinal.cantidad05 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 6) {
                                        reporteFinal.cantidad06 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 7) {
                                        reporteFinal.cantidad07 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 8) {
                                        reporteFinal.cantidad08 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 9) {
                                        reporteFinal.cantidad09 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 10) {
                                        reporteFinal.cantidad10 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 11) {
                                        reporteFinal.cantidad11 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 12) {
                                        reporteFinal.cantidad12 = objn4[keyn5];
                                      }
                                      if (parseInt(keyn5) == 13) {
                                        reporteFinal.cantidad13 = objn4[keyn5];
                                      }
                                    });
                                  });
                                }
                              });
                            }
                          });
                          reporteFinal.estilo = "";
                          this.tablaEfectividad.push(reporteFinal);
                        });
                    }
                  });
                });
              this.arrayTablaEfectividad = this.tablaEfectividad.map(function (obj) {
                return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.estilo];
              });
            }
          });
          //
          console.log(this.graficoEfectividad);
        },
        error => {
          if (error.status === 409) {
            this.validacion = 2
            // this.notifier.notify('error', 'No se encontraron registros');
          }
          if (error.status === 417) {
            // this.validacion = 2
            this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
          }
          if (error.status === 424) {
            // this.validacion = 2
            this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
          }
        }
      );
    }
    else {
      this.validacion = 0
      // this.notifier.notify('error', 'Seleccione el rango de fechas de la búsqueda');
    }
  }



  //----------ANTIGUA DATA------------------ANTIGUA DATA-------------------------ANTIGUA DATA-----------------------------ANTIGUA DATA---------------------------- ANTIGUA DATA
  // let ii = 1;
  // while ((fechaFinDate.getFullYear() - fechaIniDate.getFullYear()) * 12 + (fechaFinDate.getMonth() - fechaIniDate.getMonth()) >= 0) {
  //   this.proveedores.forEach(
  //     proveedor => {
  //       let registroTablaEfectividad = {
  //         proveedor: "", estado: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
  //         cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", estilo: ""
  //       }
  //       let cantidadPorProveedor = documentos.filter(documento => {
  //         return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
  //           new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
  //           new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
  //           (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO || this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO)
  //       }).length;

  //       let totalMes = documentos.filter(documento => {
  //         return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
  //           new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
  //           new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
  //       }).length;

  //       if (ii == 1) {
  //         registroTablaEfectividad.proveedor = proveedor.nombre;
  //         registroTablaEfectividad.estado = proveedor.nombre;
  //         registroTablaEfectividad.cantidad01 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         registroTablaEfectividad.estilo = "proveedor";
  //         this.tablaEfectividad.push(registroTablaEfectividad);
  //       }
  //       else {
  //         if (ii == 2) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad02 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 3) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad03 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 4) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad04 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 5) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad05 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 6) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad06 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 7) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad07 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 8) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad08 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 9) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad09 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 10) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad10 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 11) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad11 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 12) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad12 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //         if (ii == 13) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == proveedor.nombre).cantidad13 = this.Porcentaje(cantidadPorProveedor, totalMes);
  //       }

  //       this.estadosDocumento.forEach(
  //         estadoDocumento => {
  //           let registroTablaEfectividadEstado = {
  //             proveedor: "", estado: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
  //             cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", estilo: ""
  //           }

  //           let cantidadPorProveedorEstado = documentos.filter(documento => {
  //             return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
  //               new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
  //               new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
  //               this.documentoService.getUltimoEstado(documento).id === estadoDocumento.id
  //           }).length;

  //           if (ii == 1) {
  //             registroTablaEfectividadEstado.proveedor = proveedor.nombre;
  //             registroTablaEfectividadEstado.estado = estadoDocumento.nombre;
  //             registroTablaEfectividadEstado.cantidad01 = cantidadPorProveedorEstado.toString();
  //             registroTablaEfectividadEstado.estilo = "";
  //             this.tablaEfectividad.push(registroTablaEfectividadEstado);
  //           }
  //           else {
  //             if (ii == 2) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad02 = cantidadPorProveedorEstado.toString();
  //             if (ii == 3) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad03 = cantidadPorProveedorEstado.toString();
  //             if (ii == 4) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad04 = cantidadPorProveedorEstado.toString();
  //             if (ii == 5) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad05 = cantidadPorProveedorEstado.toString();
  //             if (ii == 6) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad06 = cantidadPorProveedorEstado.toString();
  //             if (ii == 7) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad07 = cantidadPorProveedorEstado.toString();
  //             if (ii == 8) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad08 = cantidadPorProveedorEstado.toString();
  //             if (ii == 9) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad09 = cantidadPorProveedorEstado.toString();
  //             if (ii == 10) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad10 = cantidadPorProveedorEstado.toString();
  //             if (ii == 11) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad11 = cantidadPorProveedorEstado.toString();
  //             if (ii == 12) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad12 = cantidadPorProveedorEstado.toString();
  //             if (ii == 13) this.tablaEfectividad.find(x => x.proveedor == proveedor.nombre && x.estado == estadoDocumento.nombre).cantidad13 = cantidadPorProveedorEstado.toString();
  //           }
  //         }
  //       )
  //     }
  //   )
  //   let registroGrafico = {
  //     mes: "",
  //     cantidad: "0"
  //   };
  //   let efectividad_mes = documentos.filter(documento => {
  //     return (this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.ENTREGADO || this.documentoService.getUltimoEstado(documento).id === EstadoDocumentoEnum.REZAGADO) &&
  //       new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
  //       new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
  //   }).length;

  //   let totales_mes = documentos.filter(documento => {
  //     return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
  //       new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
  //   }).length;

  //   registroGrafico.mes = this.utilsService.getNombreMes(fechaIniDate);
  //   registroGrafico.cantidad = this.Porcentaje(efectividad_mes, totales_mes);

  //   this.graficoEfectividad.push(registroGrafico);

  //   let mes = {
  //     id: 0,
  //     nombre: ""
  //   }
  //   mes.id = ii;
  //   mes.nombre = this.utilsService.getNombreMes(fechaIniDate);
  //   this.meses.push(mes);

  //   ii++;
  //   mIni++;
  //   if (mIni >= 13) {
  //     fechaIniDate = new Date(moment(new Date(fechaIniDate.getFullYear() + 1, 0, 1), "DD-MM-YYYY HH:mm:ss"));
  //   }
  //   else {
  //     fechaIniDate.setMonth(mIni);
  //   }

  //   aIni = fechaIniDate.getFullYear();
  //   mIni = fechaIniDate.getMonth();
  // }


  // this.arrayTablaEfectividad = this.tablaEfectividad.map(function (obj) {
  //   return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.estilo];
  // });
  // console.log(this.arrayTablaEfectividad);    
  // }
  //----------ANTIGUA DATA------------------ANTIGUA DATA-------------------------ANTIGUA DATA-----------------------------ANTIGUA DATA---------------------------- ANTIGUA DATA


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
    title: { text: 'Porcentaje de entregados' },
    tickMarks: { color: '#BCBCBC' },
    labels: {
      horizontalAlignment: 'right'
    },
    minValue: 0,
    unitInterval: 10,
    maxValue: 110,

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

}
