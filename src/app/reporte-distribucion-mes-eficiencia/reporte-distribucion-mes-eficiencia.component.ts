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
  documentos: Documento[] = [];

  eficienciaPorProveedor: any[] = [];
  eficienciaPorPlazoDistribucion: any[] = [];
  eficienciaPorDetalle: any[] = [];

  reportesEficienciaPorPlazoDistribucion: any = {};
  // reportesDetalleEficiencia: any = {};
  documentosSubscription: Subscription;
  // proveedorElegidoDetalle: Proveedor;

  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];

  // sumaDentroPlazoTotal: number = 0;
  // sumaFueraPlazoTotal: number = 0;

  ngOnInit() {
    this.busquedaForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });
    this.proveedores = this.proveedorService.getProveedores();
    this.proveedorService.proveedoresChanged.subscribe(proveedores => this.proveedores = proveedores);
  }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaIni'].value) &&
      !this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaFin'].value)) {
      this.documentosSubscription = this.reporteService.getReporteEficienciaPorCourier(fechaIni, fechaFin).subscribe(
        (data: any) => {
          this.data1 = data
          this.llenarEficienciaPorProveedor(data);
        }
      )
      this.documentosSubscription = this.reporteService.getReporteEficienciaCourierPorPlazos(fechaIni, fechaFin).subscribe(
        (data: any) => {
          this.data2 = data
          this.llenarEficienciaPorPlazoDistribucion(data);
        }
      )
    }
    else {
      this.notifier.notify('error', 'Seleccione un rango de fechas');
    }
  }


  //1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO
  llenarEficienciaPorProveedor(data) {
    this.eficienciaPorProveedor = [];
    let valordentroplazo = 0;
    let valorfuerplazo = 0;
    let valortotal = 0;

    this.proveedores.forEach(
      proveedor => {
        let eficienciaPorProveedorObjeto = {
          proveedor: "",
          dentroPlazo: "",
          fueraPlazo: ""
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
        let positivo1 = porcentajedentroplazo.toFixed(1);
        let positivo2 = porcentajefueraplazo.toFixed(1);
        eficienciaPorProveedorObjeto.dentroPlazo = positivo1 + "%";
        eficienciaPorProveedorObjeto.fueraPlazo = positivo2 + "%";
        this.eficienciaPorProveedor.push(eficienciaPorProveedorObjeto);
      });
      console.log("1.  eficienciaPorProveedor: ")
      console.log(this.eficienciaPorProveedor)
  }

  dentroPlazoproveedor(proveedor) {
    var a = 0;
    Object.keys(this.data1).forEach(key => {
      if (proveedor.id === parseInt(key)) {
        var obj1 = this.data1[key];
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

    Object.keys(this.data1).forEach(key => {
      if (proveedor.id === parseInt(key)) {
        var obj1 = this.data1[key];
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
    Object.keys(this.data1).forEach(key => {
      var obj1 = this.data1[key];
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
    Object.keys(this.data1).forEach(key => {
      var obj1 = this.data1[key];
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

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO

  llenarEficienciaPorPlazoDistribucion(data) {
    this.eficienciaPorPlazoDistribucion = [];
    let dentroplazoPorplazo = 0;
    let fueraplazoPorplazo = 0;
    let totalPorPlazo = 0;

    this.proveedores.forEach(
      proveedor => {        
        let dataProveedor = {
          proveedor: "",
          plazosDistribucion: [],
          porcentajePorPlazoDentro: 0,
          porcentajePorPlazoFuera: 0
        };
        let plazo = {
          id: "",
          cantidadDentro:0,
          cantidadFuera:0
        }
        dataProveedor.proveedor = proveedor.nombre;
        Object.keys(data).forEach(key => {
          var obj = data[key];
          if (proveedor.id === parseInt(key)) {
            Object.keys(obj).forEach(key1 => {
              var obj2 = obj[key1];
              let plazitoID = proveedor.plazosDistribucion.find(plazo => plazo.id === parseInt(key1))
              if (plazitoID.id === parseInt(key1)) {
                Object.keys(obj2).forEach(key2 => {
                  if(key2 == "dentroplazo"){
                    plazo.id = key1;
                    plazo.cantidadDentro = obj2[key2]
                    dentroplazoPorplazo += obj2[key2]
                  } else {
                    plazo.id = key1;
                    plazo.cantidadFuera = obj2[key2]
                    fueraplazoPorplazo += obj2[key2]
                  }
                });
                dataProveedor.plazosDistribucion.push(plazo);
                totalPorPlazo = dentroplazoPorplazo + fueraplazoPorplazo;
                this.eficienciaPorPlazoDistribucion.push(dataProveedor);
              }
            });

            let porcentajedentroplazo = ( dentroplazoPorplazo / totalPorPlazo) * 100;
            let porcentajefueraplazo = ( fueraplazoPorplazo / totalPorPlazo) * 100;     
            dataProveedor.porcentajePorPlazoDentro = porcentajedentroplazo;
            dataProveedor.porcentajePorPlazoFuera = porcentajefueraplazo;
            this.eficienciaPorPlazoDistribucion.push(dataProveedor);
          }          
        });        
        this.eficienciaPorPlazoDistribucion.push(dataProveedor);
      });
  }

  /* this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENTREGADO).subscribe(
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
   ); 
  */

    this.proveedores.forEach(
      proveedor => {
        let dataProveedor = {
          proveedor: "",
          plazosDistribucion: [],
          datagrafico: [],
          dentroPlazo: "",
          fueraPlazo: ""
        };
        dataProveedor.proveedor = proveedor.nombre;
        Object.keys(data).forEach(key => {
          var obj = data[key];
          if (proveedor.id === parseInt(key)) {

            let datagrafico = [];

            let registrografico = {
              plazo:"",
              dentroPlazo: "",
              fueraPlazo: ""
            };

            Object.keys(obj).forEach(key1 => {
              var obj2 = obj[key1];
              let plazitoID = proveedor.plazosDistribucion.find(plazo => plazo.id === parseInt(key1))

              registrografico.plazo = plazitoID.nombre;

              if (plazitoID.id === parseInt(key1)) {
                let plazo = {
                  nombre: "",
                  id: "",
                  cantidadDentro: 0,
                  cantidadFuera: 0
                }
                Object.keys(obj2).forEach(key2 => {
                  if (key2 == "dentroplazo") {
                    plazo.nombre = plazitoID.nombre
                    plazo.id = key1;
                    plazo.cantidadDentro = obj2[key2];
                    registrografico.dentroPlazo = obj2[key2];
                    dentroplazoPorplazo += obj2[key2];
                  } else {
                    plazo.nombre = plazitoID.nombre
                    plazo.id = key1;
                    plazo.cantidadFuera = obj2[key2];
                    registrografico.fueraPlazo = obj2[key2];
                    fueraplazoPorplazo += obj2[key2];
                  }
                  totalPorPlazo = dentroplazoPorplazo + fueraplazoPorplazo;
                });
                dataProveedor.plazosDistribucion.push(plazo);
                datagrafico.push(registrografico);
              }

            });
            let porcentajedentroplazo = (dentroplazoPorplazo / totalPorPlazo) * 100;
            let porcentajefueraplazo = (fueraplazoPorplazo / totalPorPlazo) * 100;
            let positivo1 = porcentajedentroplazo.toFixed(1);
            let positivo2 = porcentajefueraplazo.toFixed(1);
            dataProveedor.dentroPlazo = positivo1 + "%";
            dataProveedor.fueraPlazo = positivo2 + "%";

            //invocar funcion
            dataProveedor.datagrafico=datagrafico;

          }
        });

        

        this.eficienciaPorPlazoDistribucion.push(dataProveedor);

        // console.log("PLAZOOOOOOOOOOOOOS")
        // console.log(dataProveedor.plazosDistribucion)
      });
      // console.log("2.  eficienciaPorPlazoDistribucion: ")
      // console.log(this.eficienciaPorPlazoDistribucion)

  }

 




















  getPorcentajeDentroPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    return this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id && moment(documento.documentosGuia[0].guia.fechaLimite, "DD/MM/YYYY") >= moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD/MM/YYYY")
    ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length) * 100;
  }
  getPorcentajeFueraPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    return this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id && moment(documento.documentosGuia[0].guia.fechaLimite, "DD/MM/YYYY") < moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD/MM/YYYY")
    ).length / (this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length === 0 ? 1 : this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id && documento.envio.plazoDistribucion.id === plazoDistribucion.id).length) * 100;
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

  getAxis2(plazos) {
    let nombre1
    // console.log(plazos)

    return {
      dataField: nombre1,
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
