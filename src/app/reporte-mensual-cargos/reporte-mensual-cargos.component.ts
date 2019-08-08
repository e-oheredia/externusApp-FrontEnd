import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { ProveedorService } from '../shared/proveedor.service';
import { Documento } from 'src/model/documento.model';
import { Area } from 'src/model/area.model';
import { AreaService } from '../shared/area.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ReporteService } from '../shared/reporte.service';
import { TipoDevolucionService } from '../shared/tipodevolucion.service';
import { TipoDevolucion } from 'src/model/tipodevolucion.model';

@Component({
  selector: 'app-reporte-mensual-cargos',
  templateUrl: './reporte-mensual-cargos.component.html',
  styleUrls: ['./reporte-mensual-cargos.component.css']
})

export class ReporteMensualCargosComponent implements OnInit {

  documentoForm: FormGroup;
  documentosSubscription: Subscription;
  areasSubscription: Subscription;
  documentos: Documento[] = [];
  areas: Area[];
  proveedores: Proveedor[];
  tipoDevoluciones: TipoDevolucion[];
  devolucionElegida: TipoDevolucion;
  validacion: number;
  dataGrafico1: any[] = [];
  dataGrafico2: any[] = [];
  titulo : string;
  _registros = [];
  _registros2 = [];
  _final = [];
  _final2 = [];
  meses = [];
  data: any[] = [];

  constructor(
    public documentoService: DocumentoService,
    public notifier: NotifierService,
    public utilsService: UtilsService,
    public proveedorService: ProveedorService,
    public areaService: AreaService,
    private reporteService: ReporteService,
    private tipoDevolucionService: TipoDevolucionService
  ) { }

  ngOnInit() {
    this.validacion = 0;
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required),
      "tipoDevolucion": new FormControl(null, Validators.required)
    })

    
    this.proveedores = this.proveedorService.getProveedores();
    this.proveedorService.proveedoresChanged.subscribe(
      proveedores => {
        this.proveedores = proveedores;
      }
    )

    this.areasSubscription = this.areaService.listarAreasAll().subscribe(
      areas => {
        this.areas = areas;
      }
    )

    this.tipoDevoluciones = this.tipoDevolucionService.getTiposDevolucion();
    this.tipoDevolucionService.tiposDevolucionChanged.subscribe(
      tipodevolucion => {
        this.tipoDevoluciones = tipodevolucion;
      }
    )

  }

  mostrarReportes(fechaIni: Date, fechaFin: Date) {
    
    if(this.utilsService.isUndefinedOrNullOrEmpty(this.devolucionElegida)){
      let tipodevo = this.tipoDevoluciones.find(tipodevo => tipodevo.id === 1)
      this.devolucionElegida = tipodevo;
    }
    
    this.titulo = this.devolucionElegida.nombre.toLowerCase();
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

      this.documentosSubscription = this.reporteService.getControlCargosDocumentosDenuncias(fechaIni, fechaFin, this.devolucionElegida.id).subscribe(
        (data: any) => {
          this.validacion = 1;
          this.data = data;
          Object.keys(data).forEach(key => {
            var obj = data[key];
            if (parseInt(key) == 1) {
              this.dataGrafico1 = obj
            } else {
              this.dataGrafico2 = obj
            }
          });
          this.graficoEstadoProveedor(this.dataGrafico1);
          this.graficoEstadoProveedor2(this.dataGrafico2);
        },
        error => {
          if (error.status === 409) {
            this.validacion = 2;
            return;
          }
          if (error.status === 417) {
            this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
            return;
          }
          if (error.status === 424) {
            this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
            return;
          }
        }
      );
    }
    else {
      this.validacion = 0;
    }


  }


  graficoEstadoProveedor2(data) {
    let num = 0;
    this.areas.forEach(
      area => {
        Object.keys(data).forEach(key => {
          if (area.id == parseInt(key)) {
            let regproa = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, area: '', total: 0
            }
            var index = data[key];
            regproa.area = area.nombre;
            regproa.estado = area.nombre;

            Object.keys(index).forEach(key1 => {
              var tipo = index[key1]
              let total = 0;
              Object.keys(tipo).forEach(key2 => {
                var tipo1 = tipo[key2]

                if (parseInt(key2) == 1) {
                  regproa.cantidad01 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad01;
                }
                if (parseInt(key2) == 2) {
                  regproa.cantidad02 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad02;
                }
                if (parseInt(key2) == 3) {
                  regproa.cantidad03 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad03;
                }
                if (parseInt(key2) == 4) {
                  regproa.cantidad04 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad04;
                }
                if (parseInt(key2) == 5) {
                  regproa.cantidad05 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad05;
                }
                if (parseInt(key2) == 6) {
                  regproa.cantidad06 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad06;
                }
                if (parseInt(key2) == 7) {
                  regproa.cantidad07 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad07;
                }
                if (parseInt(key2) == 8) {
                  regproa.cantidad08 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad08;
                }
                if (parseInt(key2) == 9) {
                  regproa.cantidad09 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad09;
                }
                if (parseInt(key2) == 10) {
                  regproa.cantidad10 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad10;
                }
                if (parseInt(key2) == 11) {
                  regproa.cantidad11 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad11;
                }
                if (parseInt(key2) == 12) {
                  regproa.cantidad12 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad12;
                }
                if (parseInt(key2) == 13) {
                  regproa.cantidad13 = tipo1;
                  regproa.total = regproa.total + regproa.cantidad13;
                }
              });
            });
            num = 1;
            this._final2.push(regproa);
          }
        });
      });
    this._registros2 = this._final2.map(function (obj) {
      return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.total];
    });

  }


  graficoEstadoProveedor(data) {
    this.meses = [];
    this._registros = [];
    this._registros2 = [];
    this._final = [];
    this._final2 = [];
    var num = 0;
    this.proveedores.forEach(
      proveedor => {
        Object.keys(data).forEach(key => {
          if (proveedor.id == parseInt(key)) {
            let totalMeses = 0;
            let regpro = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, proveedor: '', total: 0
            }
            let devuelto = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, proveedor: '', total: 0
            }
            let pendiente = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, proveedor: '', total: 0
            }
            regpro.proveedor = proveedor.nombre;
            regpro.estado = proveedor.nombre;
            var index = data[key];
            let cd = 0;
            let cp = 0;
            Object.keys(index).forEach(key1 => {
              var tipo = index[key1]
              let total = 0;
              Object.keys(tipo).forEach(key2 => {
                var tipo1 = tipo[key2]
                if (num == 0) {
                  let mes = {
                    id: 0,
                    nombre: ""
                  }
                  mes.id = parseInt(key2);
                  mes.nombre = this.utilsService.getNombreMes2(parseInt(key2));
                  this.meses.push(mes);
                }
                Object.keys(tipo1).forEach(key3 => {
                  if (parseInt(key2) == 1) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad01 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad01;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad01 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad01;
                    }
                    regpro.cantidad01 = devuelto.cantidad01 + pendiente.cantidad01;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 2) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad02 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad02;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad02 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad02;
                    }
                    regpro.cantidad02 = devuelto.cantidad02 + pendiente.cantidad02;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 3) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad03 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad03;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad03 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad03;
                    }
                    regpro.cantidad03 = devuelto.cantidad03 + pendiente.cantidad03;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 4) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad04 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad04;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad04 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad04;
                    }
                    regpro.cantidad04 = devuelto.cantidad04 + pendiente.cantidad04;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 5) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad05 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad05;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad05 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad05;
                    }
                    regpro.cantidad05 = devuelto.cantidad05 + pendiente.cantidad05;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 6) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad06 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad06;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad06 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad06;
                    }
                    regpro.cantidad06 = devuelto.cantidad06 + pendiente.cantidad06;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 7) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad07 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad07;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad07 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad07;
                    }
                    regpro.cantidad07 = devuelto.cantidad07 + pendiente.cantidad07;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 8) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad08 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad08;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad08 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad08;
                    }
                    regpro.cantidad08 = devuelto.cantidad08 + pendiente.cantidad08;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 9) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad09 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad09;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad09 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad09;
                    }
                    regpro.cantidad09 = devuelto.cantidad09 + pendiente.cantidad09;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 10) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad10 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad10;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad10 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad10;
                    }
                    regpro.cantidad10 = devuelto.cantidad10 + pendiente.cantidad10;
                    regpro.total = devuelto.total + pendiente.total;

                  }
                  if (parseInt(key2) == 11) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad11 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad11;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad11 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad11;
                    }
                    regpro.cantidad11 = devuelto.cantidad11 + pendiente.cantidad11;
                    regpro.total = devuelto.total + pendiente.total;

                  }
                  if (parseInt(key2) == 12) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad12 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad12;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad12 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad12;
                    }
                    regpro.cantidad12 = devuelto.cantidad12 + pendiente.cantidad12;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                  if (parseInt(key2) == 13) {
                    if (key3 == "devuelto") {
                      devuelto.estado = 'DEVUELTO';
                      devuelto.cantidad13 = tipo1[key3];
                      devuelto.total = devuelto.total + devuelto.cantidad13;
                    } else {
                      pendiente.estado = 'PENDIENTE';
                      pendiente.cantidad13 = tipo1[key3];
                      pendiente.total = pendiente.total + pendiente.cantidad13;
                    }
                    regpro.cantidad13 = devuelto.cantidad13 + pendiente.cantidad13;
                    regpro.total = devuelto.total + pendiente.total;
                  }
                });
              });
            });
            num = 1;
            this._final.push(regpro);
            this._final.push(devuelto);
            this._final.push(pendiente);
          }
        });
      });

    let regtotal = {
      estado: '',
      cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
      cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, nombre: '', total: 0
    }

    regtotal.nombre = "TOTALITO";
    regtotal.estado = "TOTAL";
    let total = 0;
    Object.keys(data).forEach(key => {
      var index = data[key];
      let cd = 0;
      let cp = 0;

      Object.keys(index).forEach(key1 => {
        var tipo = index[key1]
        Object.keys(tipo).forEach(key2 => {
          var tipo1 = tipo[key2]
          Object.keys(tipo1).forEach(key3 => {
            if (parseInt(key2) == 1) {
              regtotal.cantidad01 = regtotal.cantidad01 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 2) {
              regtotal.cantidad02 = regtotal.cantidad02 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 3) {
              regtotal.cantidad03 = regtotal.cantidad03 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 4) {
              regtotal.cantidad04 = regtotal.cantidad04 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 5) {
              regtotal.cantidad05 = regtotal.cantidad05 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 6) {
              regtotal.cantidad06 = regtotal.cantidad06 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 7) {
              regtotal.cantidad07 = regtotal.cantidad07 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 8) {
              regtotal.cantidad08 = regtotal.cantidad08 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 9) {
              regtotal.cantidad09 = regtotal.cantidad09 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 10) {
              regtotal.cantidad10 = regtotal.cantidad10 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 11) {
              regtotal.cantidad11 = regtotal.cantidad11 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 12) {
              regtotal.cantidad12 = regtotal.cantidad12 + tipo1[key3];
              total = total + tipo1[key3];
            }
            if (parseInt(key2) == 13) {
              regtotal.cantidad13 = regtotal.cantidad13 + tipo1[key3];
              total = total + tipo1[key3];
            }
          });
        });
      });
    });

    regtotal.total = total;
    this._final.push(regtotal);

    this._registros = this._final.map(function (obj) {
      return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.total];
    });

  }
  

}
