import { PlazoDistribucion } from './../../model/plazodistribucion.model';
import { PlazoDistribucionService } from './../shared/plazodistribucion.service';
import { Documento } from './../../model/documento.model';
import { EstadoDocumentoEnum } from './../enum/estadodocumento.enum';
import { NotifierService } from 'angular-notifier';
import { DocumentoService } from './../shared/documento.service';
import { Subscription } from 'rxjs';
import { UtilsService } from './../shared/utils.service';
import { FormGroup, Validators, FormControl, AbstractControlDirective } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../shared/proveedor.service';
import { Proveedor } from '../../model/proveedor.model';
import * as moment from "moment-timezone";
import { ReporteService } from '../shared/reporte.service';

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
    private reporteService: ReporteService,
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
  data: any[] = [];
  dataGrafico1: any[] = [];
  dataGrafico2: any[] = [];
  sumaDentroPlazoTotal: number = 0;
  sumaFueraPlazoTotal: number = 0;

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


      this.documentosSubscription = this.reporteService.getReporteEficienciaPorCourier(fechaIni, fechaFin).subscribe(
        (data: any) => {
          this.data = data
          Object.keys(data).forEach(key => {
            var obj = data[key];
            if (parseInt(key) == 1) {
              this.dataGrafico1 = obj
            } else {
              this.dataGrafico2 = obj
            }

          });
          this.llenarEficienciaPorProveedor(this.dataGrafico1);
          this.llenarEficienciaPorPlazo(this.dataGrafico2);
        }
      )



      /*  this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENTREGADO).subscribe(
         documentos => {
           this.documentos = documentos;
           this.llenarEficienciaPorProveedor(this.data);
           this.llenarEficienciaPorPlazoDistribucion(documentos);
           this.llenarDetalleEficiencia(documentos);
         },
         error => {
           if (error.status === 400) {
             this.notifier.notify('error', error.error);
           }
         }
       ); */
    }
    else {
      this.notifier.notify('error', 'Seleccione un rango de fechas');
    }
  }

  /*   getKeys(cantidadesporproveedor){
      let abc = Array.from(cantidadesporproveedor.getKeys);
      return abc;
    } */

  /*   getPorcentajeDentroPlazoPorProveedor(proveedor = { id: 0 }) {
      if (proveedor.id === 0) {
        return this.documentos.filter(documento => moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") ).length / (this.documentos.length === 0 ? 1 : this.documentos.length) * 100;
      } else {
        return this.documentos.filter(documento =>
          documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
          moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
        ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length) * 100;
      }
    }
  
    getPorcentajeFueraPlazoPorProveedor(proveedor = { id: 0 }) {
      if (proveedor.id === 0) {
        return this.documentos.filter(documento => moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") < moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") ).length / (this.documentos.length === 0 ? 1 : this.documentos.length) * 100;
      } else {
        return this.documentos.filter(documento =>
          documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
          moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") <  moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
        ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length) * 100;
      }
    } */

  llenarEficienciaPorProveedor(data) {
    this.eficienciaPorProveedor = [];
    let valordentroplazo = 0;
    let valorfuerplazo = 0;
    let valortotal = 0;
    this.proveedores.forEach(
      proveedor => {
        let eficienciaPorProveedorObjeto = {
          proveedor: "",
          dentroPlazo: 0,
          fueraPlazo: 0
        };
        eficienciaPorProveedorObjeto.proveedor = proveedor.nombre;
        Object.keys(data).forEach(key => {
          var obj = data[key];
          if (proveedor.id === parseInt(key)) {
            Object.keys(obj).forEach(key1 => {
              if (key1 == "dentroplazo") {
                valordentroplazo = obj[key1]
              } else {
                valorfuerplazo = obj[key1]
              }
            });
          }
        });
        valortotal = valordentroplazo + valorfuerplazo;
        let porcentajedentroplazo = (valordentroplazo / valortotal) * 100;
        let porcentajefueraplazo = (valorfuerplazo / valortotal) * 100;
        eficienciaPorProveedorObjeto.dentroPlazo = porcentajedentroplazo;
        eficienciaPorProveedorObjeto.fueraPlazo = porcentajefueraplazo;
        this.eficienciaPorProveedor.push(eficienciaPorProveedorObjeto);
      });
    console.log(this.eficienciaPorProveedor)
  }



  dentroPlazoproveedor(proveedor) {
    var a = 0;
    Object.keys(this.dataGrafico1).forEach(key => {
      if (proveedor.id === parseInt(key)) {
        var obj1 = this.dataGrafico1[key];
        Object.keys(obj1).forEach(key1 => {
          if (key1 == "dentroplazo") {
            a = obj1[key1];
          }
        });
      }
    });

    var numero = a;
    return numero;

  }

  fueraPlazoproveedor(proveedor) {
    var a = 0;

    Object.keys(this.dataGrafico1).forEach(key => {
      if (proveedor.id === parseInt(key)) {
        var obj1 = this.dataGrafico1[key];
        Object.keys(obj1).forEach(key1 => {
          if (key1 == "fueraplazo") {
            a = obj1[key1];
          }
        });

      }
    });
    var numero = a;
    return numero;

  }

  sumadentroplazo() {
    var a = 0;
    Object.keys(this.dataGrafico1).forEach(key => {
      var obj1 = this.dataGrafico1[key];
      Object.keys(obj1).forEach(key1 => {
        if (key1 == "dentroplazo") {
          a = a + obj1[key1];
        }
      });
    });
    var numero = a;
    var final = numero;
    return final;
  }

  sumafueraplazo() {
    var a = 0;
    Object.keys(this.dataGrafico1).forEach(key => {
      var obj1 = this.dataGrafico1[key];
      Object.keys(obj1).forEach(key1 => {
        if (key1 == "fueraplazo") {
          a = a + obj1[key1];
        }
      });
    });
    var numero = a;
    var final = numero;
    return final;
  }



  /* llenarEficienciaPorProveedor(documentos: Documento[]) {
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
          moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
        ).length;
        eficienciaPorProveedorObjeto.fueraPlazo = documentos.filter(documento => {
          return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && 
            moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") <  moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
        }).length;
        this.eficienciaPorProveedor.push(eficienciaPorProveedorObjeto);
      }
    )
  } */
/*   llenarEficienciaPorPlazoDistribucion(documentos: Documento[]) {
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
              moment(documento.documentosGuia[0].guia.fechaLimite, "DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD/MM/YYYY")
            ).length,
            fueraPlazo: documentos.filter(documento =>
              documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
              documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
              moment(documento.documentosGuia[0].guia.fechaLimite, "DD/MM/YYYY") < moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD/MM/YYYY")
            ).length,
          }
          eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
        });
        this.reportesEficienciaPorPlazoDistribucion[proveedor.nombre] = eficienciaPorPlazoDistribucionPorProveedor;
      }
    )
  } */

  llenarEficienciaPorPlazo(data) {
    this.reportesEficienciaPorPlazoDistribucion = {};
    let valordentroplazo = "";
    let valorfueraplazo = "";

    this.proveedores.forEach(
      proveedor => {
        let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];
        proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion => {
          Object.keys(data).forEach(key => {
            if (proveedor.id == parseInt(key)) {
              var obj = data[key];
              Object.keys(obj).forEach(key1 => {
                if (plazoDistribucion.id == parseInt(key1)) {
                  var obj1 = obj[key1];
                  let total = 0
                  for (var el in obj1) {
                    if (obj1.hasOwnProperty(el)) {
                      total += parseInt(obj1[el]);
                    }
                  }
                  if (total !== 0) {
                    Object.keys(obj1).forEach(key2 => {
                      if (key2 == "dentroplazo") {
                        var resultadodentro = (obj1[key2] * 100) / total;
                        if (isNaN(resultadodentro)) {
                          resultadodentro = 0;
                        }
                        valordentroplazo = resultadodentro.toFixed(1) + '%';
                      } else {
                        var resultadofuera = (obj1[key2] * 100) / total;
                        if (isNaN(resultadofuera)) {
                          resultadofuera = 0;
                        }
                        valorfueraplazo = resultadofuera.toFixed(1) + '%';
                      }
                    });
                  } else {
                    valordentroplazo = '0.0%';
                    valorfueraplazo = '0.0%';
                  }
                  let eficienciaPorPlazoDistribucionPorProveedorObjeto = {
                    plazoDistribucion: plazoDistribucion.nombre,
                    dentroPlazo: valordentroplazo,
                    fueraPlazo: valorfueraplazo
                  }
                  eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
                }
              });
            }
          });
        });
        this.reportesEficienciaPorPlazoDistribucion[proveedor.nombre] = eficienciaPorPlazoDistribucionPorProveedor;
      });
  }

  getPorcentajeDentroPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    let valor = 0;
    Object.keys(this.dataGrafico2).forEach(key => {
      if (proveedor.id == parseInt(key)) {
        var plazos = this.dataGrafico2[key]
        Object.keys(plazos).forEach(key1 => {
          if (plazoDistribucion.id == parseInt(key1)) {
            var dentrofuera = plazos[key1]
            Object.keys(dentrofuera).forEach(key2 => {
              if (key2 == 'dentroplazo') {
                valor = dentrofuera[key2]
              }
            });
          }
        });
      }
    });

    return valor;
  }
  getPorcentajeFueraPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    let valor = 0;
    Object.keys(this.dataGrafico2).forEach(key => {
      if (proveedor.id == parseInt(key)) {
        var plazos = this.dataGrafico2[key]
        Object.keys(plazos).forEach(key1 => {
          if (plazoDistribucion.id == parseInt(key1)) {
            var dentrofuera = plazos[key1]
            Object.keys(dentrofuera).forEach(key2 => {
              if (key2 == 'fueraplazo') {
                valor = dentrofuera[key2]
              }
            });
          }
        });
      }
    });
    return valor;
  }


  /*     llenarDetalleEficiencia(documentos: Documento[]) {
        this.reportesDetalleEficiencia = {};
      let documentosAux: Documento[] = [];
      this.proveedores.forEach(
        proveedor => {
          proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion => {
            let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];
            proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion2 => {
              let eficienciaPorPlazoDistribucionPorProveedorObjeto = {
                plazoDistribucion: plazoDistribucion2.tiempoEnvio + ' H',
                dentroPlazo: documentos.filter(documento => {
                  if (documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                    documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                    moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
                  ) {
                    return true;
                  }
                  documentosAux.push(documento);
                }).length
              }
              documentos = documentosAux;
              documentosAux = [];
              eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
            });
            eficienciaPorPlazoDistribucionPorProveedor.push({
              plazoDistribucion: 'Más',
              dentroPlazo: documentos.filter(documento =>
                documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                moment(documento.documentosGuia[0].guia.fechaLimite,"DD/MM/YYYY") <  moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha,"DD/MM/YYYY") 
              ).length
            });
            this.reportesDetalleEficiencia[proveedor.nombre + '-' + plazoDistribucion.id] = eficienciaPorPlazoDistribucionPorProveedor;
          });
        }
      )
    } */

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

  getValueAxis(title: string, flip = false) {
    return {
      title: { text: title },
      flip: flip,
      tickMarks: { color: '#BCBCBC' },
      labels: { visible: true },
      minValue: 0,
      maxValue: 'auto',
    }
  }

  getSeriesGroups(type: string, datas: any[], orientation = 'vertical', columnsGapPercent = 100) {
    let series: any[] = [];
    datas.forEach(data => {
      let keys: string[] = Object.keys(data);
      if (keys.length == 1) {
        series.push({
          dataField: keys[0],
          showLabels: true,
          displayText: data[keys[0]]
        })
      } else {
        series.push({
          dataField: keys[0],
          showLabels: true,
          displayText: data[keys[0]],
          colorFunction: (value, itemIndex) => {
            if (data['indiceReporte'] < itemIndex) {
              return '#dc3545';
            }
            return '#007bff';
          }
        })
      }
    });


    return [
      {
        type: type,
        columnsGapPercent: columnsGapPercent,
        orientation: orientation,
        series: series
      }
    ]
  }
}
