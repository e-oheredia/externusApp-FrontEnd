import { PlazoDistribucionService } from './../shared/plazodistribucion.service';
import { Documento } from './../../model/documento.model';
import { NotifierService } from 'angular-notifier';
import { DocumentoService } from './../shared/documento.service';
import { Subscription } from 'rxjs';
import { UtilsService } from './../shared/utils.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../shared/proveedor.service';
import { Proveedor } from '../../model/proveedor.model';
import { ReporteService } from '../shared/reporte.service';
import { Region } from '../../model/region.model';
import { RegionService } from '../shared/region.service';

@Component({
  selector: 'app-reporte-distribucion-mes-eficiencia',
  templateUrl: './reporte-distribucion-mes-eficiencia.component.html',
  styleUrls: ['./reporte-distribucion-mes-eficiencia.component.css']
})

export class ReporteEficienciaComponent implements OnInit {

  busquedaForm: FormGroup;
  documentosSubscription: Subscription;
  proveedores: Proveedor[] = [];
  documentos: Documento[] = [];
  proveedorElegidoDetalle: Proveedor;
  eficienciaPorProveedor: any[] = [];
  eficienciaPorPlazoDistribucion: any[] = [];
  eficienciaPorDetalle: any[] = [];
  dataGrafico1: any[] = [];
  dataGrafico2: any[] = [];
  dataGrafico3: any[] = [];
  data: any[] = [];
  reportesEficienciaPorPlazoDistribucion: any = {};
  reportesDetalleEficiencia: any = {};
  validacion: number;
  sumaDentroPlazoTotal: number = 0;
  sumaFueraPlazoTotal: number = 0;
  regionesall: Region[] = [];
  regiones: Region[] = [];
  regiones2: Region[] = [];

  constructor(
    private proveedorService: ProveedorService,
    private utilsService: UtilsService,
    private reporteService: ReporteService,
    private notifier: NotifierService,
    public regionService: RegionService
  ) { }

  ngOnInit() {
    this.validacion = 0;
    this.busquedaForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    });
    this.proveedores = this.proveedorService.getProveedores();
    this.regionesall = this.regionService.getRegiones();
    this.proveedorService.proveedoresChanged.subscribe(
      proveedores =>
        this.proveedores = proveedores
    );

    this.regionService.regionesChanged.subscribe(
      region =>
        this.regionesall = region
    );
  }

  MostrarReportes(fechaIni: Date, fechaFin: Date) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaIni'].value) &&
      !this.utilsService.isUndefinedOrNullOrEmpty(this.busquedaForm.controls['fechaFin'].value)) {
      this.documentosSubscription = this.reporteService.getReporteEficienciaPorCourier(fechaIni, fechaFin).subscribe(
        (data: any) => {
          this.validacion = 1;
          this.data = data;

          Object.keys(data).forEach(key => {
            var obj = data[key];
            if (parseInt(key) == 1) {
              this.dataGrafico1 = obj
            }
            if (parseInt(key) == 2) {
              this.dataGrafico2 = obj
            }
            if (parseInt(key) == 3) {
              this.dataGrafico3 = obj
            }
          });
          this.llenarEficienciaPorProveedor(this.dataGrafico1);
          this.llenarEficienciaPorPlazovsProveedor(this.dataGrafico2);
          this.llenarEficienciaPorPlazo(this.dataGrafico3);
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
      )
    }
    else {
      this.validacion = 0
    }
  }

  sinrepetir(ambitos) {
    let unicos = [];
    ambitos.forEach(it => {
      if (unicos.indexOf(it) == -1)
        unicos.push(it);
    })
    return unicos;
  }

  regionesxproveedor(proveedor) {
    let regiones: any[] = [];

    proveedor.ambitos.sort((a, b) => a.region.id - b.region.id).forEach(ambito => {
      regiones.push(ambito.region);
    });
    regiones = this.sinrepetir(regiones);
    return regiones;
  }

  regionesxproveedor2(proveedor) {
    let regiones: any[] = [];

    proveedor.ambitos.sort((a, b) => a.region.id - b.region.id).forEach(ambito => {
      regiones.push(ambito.region);
    });
    regiones = this.sinrepetir(regiones);
    return regiones;
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

        if (isNaN(porcentajedentroplazo)) {
          porcentajedentroplazo = 0;
        }
        if (isNaN(porcentajefueraplazo)) {
          porcentajefueraplazo = 0;
        }
        eficienciaPorProveedorObjeto.dentroPlazo = porcentajedentroplazo.toFixed(1) + "%";
        eficienciaPorProveedorObjeto.fueraPlazo = porcentajefueraplazo.toFixed(1) + "%";
        this.eficienciaPorProveedor.push(eficienciaPorProveedorObjeto);
      });
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


  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO

  llenarEficienciaPorPlazovsProveedor(data) {
    this.reportesEficienciaPorPlazoDistribucion = {};
    let valordentroplazo = "";
    let valorfueraplazo = "";

    this.proveedores.forEach(
      proveedor => {
        let regiones: any[] = [];
        proveedor.ambitos.forEach(ambito => {
          ambito.region.plazosDistribucion.sort((a, b) => a.id - b.id).forEach(plazoDistribucion => {
            Object.keys(data).forEach(key => {
              if (proveedor.id == parseInt(key)) {
                var obj1 = data[key];
                Object.keys(obj1).forEach(keyregion => {
                  let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];

                  var obj = obj1[keyregion];

                  proveedor.ambitos.forEach(ambito => {
                    regiones.push(ambito.region);
                  });

                  this.regiones = this.sinrepetir(regiones);
                  this.regiones.sort((a, b) => a.id - b.id).forEach(region => {

                    if (parseInt(keyregion) == region.id) {
                      region.plazosDistribucion.sort((a, b) => a.id - b.id).forEach(
                        plazoDistribucion => {
                          Object.keys(obj).forEach(keyplazo => {
                            if (plazoDistribucion.id == parseInt(keyplazo)) {
                              var objf = obj[keyplazo];
                              let total = 0
                              for (var el in objf) {
                                if (objf.hasOwnProperty(el)) {
                                  total += parseInt(objf[el]);
                                }
                              }
                              if (total !== 0) {
                                Object.keys(objf).forEach(key2 => {
                                  if (key2 == "dentroplazo") {
                                    var resultadodentro = (objf[key2] * 100) / total;
                                    if (isNaN(resultadodentro)) {
                                      resultadodentro = 0;
                                    }
                                    valordentroplazo = resultadodentro.toFixed(1) + '%';
                                  } else {
                                    var resultadofuera = (objf[key2] * 100) / total;
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
                        });
                    }
                  });
                  this.reportesEficienciaPorPlazoDistribucion[proveedor.nombre + '-' + keyregion] = eficienciaPorPlazoDistribucionPorProveedor;
                });
              }
            });
          });
        });       
      });
  }

  getPorcentajeDentroPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    let valor = 0;
    Object.keys(this.dataGrafico2).forEach(key => {
      if (proveedor.id == parseInt(key)) {
        var regiones = this.dataGrafico2[key];
        Object.keys(regiones).forEach(region => {
          var plazos = regiones[region]
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
        })
      }
    });
    return valor;
  }

  getPorcentajeFueraPlazoPorProveedorYPlazoDistribucion(proveedor, plazoDistribucion) {
    let valor = 0;
    Object.keys(this.dataGrafico2).forEach(key => {
      if (proveedor.id == parseInt(key)) {
        var regiones = this.dataGrafico2[key];
        Object.keys(regiones).forEach(region => {
          var plazos = regiones[region]
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
        });
      }
    });
    return valor;
  }

  plazosxregion(region) {
    return region.plazosDistribucion;
  }

  estadoProveedor(proveedor, estado) {
    var cantidad = 0;
    Object.keys(this.data).forEach(key => {
      if (estado.id === parseInt(key)) {
        var provedor = this.data[key]
        Object.keys(provedor).forEach(key1 => {
          if (proveedor.id === parseInt(key1)) {
            cantidad = provedor[key1];
          }
        });
      }
    });
    return cantidad;
  }


  //3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO//3-GRAFICO
  llenarEficienciaPorPlazo(data) {
    this.reportesDetalleEficiencia = {};

    this.proveedores.forEach(
      proveedor => {
        let regiones: any[] = [];
        proveedor.ambitos.forEach(ambito => {
          ambito.region.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(PlazoDistribucion => {
            let eficienciaPorPlazo: any[] = [];
            Object.keys(data).forEach(key => {
              if (proveedor.id == parseInt(key)) {
                let eficienciaPorPlazoDistribucionPorProveedor: any[] = [];
                var arregloregion = data[key];
                Object.keys(arregloregion).forEach(keyregion => {
                  proveedor.ambitos.forEach(ambito => {
                    regiones.push(ambito.region);
                  });
                  this.regiones2 = this.sinrepetir(regiones);
                  this.regiones2.sort((a, b) => a.id - b.id).forEach(region => {
                    if (parseInt(keyregion) == region.id) {
                      var datosproveedor = arregloregion[keyregion];
                      Object.keys(datosproveedor).forEach(key1 => {
                        if (PlazoDistribucion.id == parseInt(key1)) {
                          var datosproveedorplazos = datosproveedor[key1]; //{0:1,1:2}
                          ambito.region.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(plazoDistribucion2 => {
                            Object.keys(datosproveedorplazos).forEach(key2 => {
                              var iddeplazos = datosproveedorplazos[key2];
                              if (plazoDistribucion2.id == parseInt(key2)) {
                                let eficienciaPorPlazoDistribucionPorProveedorObjeto = {
                                  plazoDistribucion: plazoDistribucion2.tiempoEnvio + 'H',
                                  dentroPlazo: iddeplazos
                                }
                                eficienciaPorPlazoDistribucionPorProveedor.push(eficienciaPorPlazoDistribucionPorProveedorObjeto);
                              }
                            });
                          });
                          Object.keys(datosproveedorplazos).forEach(key2 => {
                            if (0 == parseInt(key2)) {
                              eficienciaPorPlazoDistribucionPorProveedor.push({
                                plazoDistribucion: 'Más',
                                dentroPlazo: datosproveedorplazos[key2]
                              });
                            }
                          });
                          this.reportesDetalleEficiencia[proveedor.nombre + '-' + PlazoDistribucion.id + '-' + region.id] = eficienciaPorPlazoDistribucionPorProveedor;
                        }
                      });
                    }
                  });
                });
              }
            });
          });
        })
      }
    )
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            } else if (data['indiceReporte'] == itemIndex) {
              return '#44B876'
            } else {
              return '#007bff';
            }

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