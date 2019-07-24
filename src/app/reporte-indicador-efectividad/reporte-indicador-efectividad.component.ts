import { EstadoDocumento } from './../../model/estadodocumento.model';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
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

  busquedaForm: FormGroup;
  documentosSubscription: Subscription;
  estadosDocumento: EstadoDocumento[];
  proveedores: Proveedor[];
  dataSource = [];
  data: any[] = [];
  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];
  graficoEfectividad: any[] = [];
  validacion: number;
  meses = [];
  tablaEfectividad = [];
  arrayTablaEfectividad = [];

  constructor(
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    private reporteService: ReporteService,
    private estadoDocumentoService: EstadoDocumentoService,
    private notifier: NotifierService
  ) { }

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

  MostrarReportes(fechaIni: Date, fechaFin: Date) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) &&
      !this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {

      let fechaIniDate = new Date(fechaIni);
      let fechaFinDate = new Date(fechaFin);
      fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
      fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());

      this.documentosSubscription = this.reporteService.getReporteIndicadorEficaciaGrafico(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD')).subscribe(
        (data: any) => {
          this.validacion = 1;
          this.data = data;
          this.meses = [];
          this.graficoEfectividad = [];
          this.tablaEfectividad = [];
          this.arrayTablaEfectividad = [];

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
                        }
                      );
                    }
                  });
                });
              this.arrayTablaEfectividad = this.tablaEfectividad.map(function (obj) {
                return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.estilo];
              });
            }
          });
        },
        error => {
          if (error.status === 409) {
            this.validacion = 2
          }
          if (error.status === 417) {
            this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
          }
          if (error.status === 424) {
            this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
          }
        }
      );
    }
    else {
      this.validacion = 0
    }
  }



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
