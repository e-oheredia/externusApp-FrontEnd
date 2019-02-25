import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { ProveedorService } from '../shared/proveedor.service';
import * as moment from 'moment-timezone';
import { Documento } from 'src/model/documento.model';
import { Area } from 'src/model/area.model';
import { AreaService } from '../shared/area.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { Proveedor } from 'src/model/proveedor.model';

@Component({
  selector: 'app-reporte-mensual-cargos',
  templateUrl: './reporte-mensual-cargos.component.html',
  styleUrls: ['./reporte-mensual-cargos.component.css']
})
export class ReporteMensualCargosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService,
    public notifier: NotifierService,
    public utilsService: UtilsService,
    public proveedorService: ProveedorService,
    public areaService: AreaService
  ) { }

  documentoForm: FormGroup;
  documentosSubscription: Subscription;
  documentos: Documento[] = [];
  areas: Area[];
  proveedores: Proveedor[];
  areasSubscription: Subscription;

  _registros = [];
  _registros2 = [];
  _final = [];
  _final2 = [];
  meses = [];


  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
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

  }

  mostrarReportes(fechaIni: Date, fechaFin: Date) {

    let fi = new Date(new Date(fechaIni).getTimezoneOffset() * 60 * 1000 + new Date(fechaIni).getTime());
    let ff = new Date(new Date(fechaFin).getTimezoneOffset() * 60 * 1000 + new Date(fechaFin).getTime());
    let fechaInicial = new Date(moment(new Date(fi.getFullYear(), fi.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
    let fechaFinal = new Date(moment(new Date(ff.getFullYear(), ff.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
    let aIni = fechaInicial.getFullYear();
    let mIni = fechaInicial.getMonth();
    let aFin = fechaFinal.getFullYear();
    let mFin = fechaFinal.getMonth();


    if ((aFin - aIni) * 12 + (mFin - mIni) >= 13) {
      this.notifier.notify('error', 'SELECCIONE COMO MÁXIMO UN PERIODO DE 13 MESES');
      return;
    }

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

      this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENTREGADO).subscribe(
        documentos => {
          this.documentos = documentos;
          this.meses = [];
          this._registros = [];
          this._registros2 = [];
          this._final = [];
          this._final2 = [];

          let ii = 1;

          while (((aFin - aIni) * 12 + (mFin - mIni)) >= 0) {

            this.proveedores.forEach(
              proveedor => {

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


                let cd = documentos.filter(documento => {
                  return documento.recepcionado === true &&
                    documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
                }
                ).length;

                let cp = documentos.filter(documento => {
                  return documento.recepcionado === false &&
                    documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
                }
                ).length;

                if (ii == 1) {

                  regpro.proveedor = proveedor.nombre;
                  regpro.estado = proveedor.nombre;
                  regpro.cantidad01 = cd + cp;
                  regpro.total = cd + cp;

                  devuelto.proveedor = proveedor.nombre;
                  devuelto.estado = 'DEVUELTO';
                  devuelto.cantidad01 = cd;
                  devuelto.total = cd;

                  pendiente.proveedor = proveedor.nombre;
                  pendiente.estado = 'PENDIENTE';
                  pendiente.cantidad01 = cp;
                  pendiente.total = cp;

                  this._final.push(regpro);
                  this._final.push(devuelto);
                  this._final.push(pendiente);

                }
                else {
                  if (ii == 2) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad02 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad02 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad02 = cp + cd;

                  }
                  if (ii == 3) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad03 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad03 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad03 = cp + cd;
                  }
                  if (ii == 4) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad04 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad04 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad04 = cp + cd;
                  }
                  if (ii == 5) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad05 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad05 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad05 = cp + cd;
                  }
                  if (ii == 6) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad06 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad06 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad06 = cp + cd;
                  }
                  if (ii == 7) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad07 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad07 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad07 = cp + cd;
                  }
                  if (ii == 8) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad08 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad08 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad08 = cp + cd;
                  }
                  if (ii == 9) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad09 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad09 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad09 = cp + cd;
                  }
                  if (ii == 10) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad10 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad10 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad10 = cp + cd;
                  }
                  if (ii == 11) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad11 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad11 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad11 = cp + cd;
                  }
                  if (ii == 12) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad12 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad12 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad12 = cp + cd;
                  }
                  if (ii == 13) {
                    this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).cantidad13 = cd;
                    this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).cantidad13 = cp;
                    this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).cantidad13 = cp + cd;
                  }


                  let c1 = this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).total;
                  let c2 = this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).total;
                  let c3 = this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).total;

                  this._final.find(x => x.estado === 'DEVUELTO' && x.proveedor === proveedor.nombre).total = c1 + cd;
                  this._final.find(x => x.estado === 'PENDIENTE' && x.proveedor === proveedor.nombre).total = c2 + cp;
                  this._final.find(x => x.estado === proveedor.nombre && x.proveedor === proveedor.nombre).total = c3 + cd + cp;

                }

              }
            )

            let regtotal = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, nombre: '', total: 0
            }

            //cargos por courier pendientes
            let cpcp = documentos.filter(documento => {
              return documento.recepcionado === false &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
            }).length;

            //cargos por courier devueltos
            let cpcd = documentos.filter(documento => {
              return documento.recepcionado === true &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
            }).length;

            if (ii == 1) {
              regtotal.nombre = "TOTALITO";
              regtotal.estado = "TOTAL";
              regtotal.cantidad01 = cpcp + cpcd;
              regtotal.total = cpcp + cpcd;
              this._final.push(regtotal);
            }
            else {
              if (ii == 2) {
                this._final.find(x => x.estado === "TOTAL").cantidad02 = cpcp + cpcd;
              }
              if (ii == 3) {
                this._final.find(x => x.estado === "TOTAL").cantidad03 = cpcp + cpcd;
              }
              if (ii == 4) {
                this._final.find(x => x.estado === "TOTAL").cantidad04 = cpcp + cpcd;
              }
              if (ii == 5) {
                this._final.find(x => x.estado === "TOTAL").cantidad05 = cpcp + cpcd;
              }
              if (ii == 6) {
                this._final.find(x => x.estado === "TOTAL").cantidad06 = cpcp + cpcd;
              }
              if (ii == 7) {
                this._final.find(x => x.estado === "TOTAL").cantidad07 = cpcp + cpcd;
              }
              if (ii == 8) {
                this._final.find(x => x.estado === "TOTAL").cantidad08 = cpcp + cpcd;
              }
              if (ii == 9) {
                this._final.find(x => x.estado === "TOTAL").cantidad09 = cpcp + cpcd;
              }
              if (ii == 10) {
                this._final.find(x => x.estado === "TOTAL").cantidad10 = cpcp + cpcd;
              }
              if (ii == 11) {
                this._final.find(x => x.estado === "TOTAL").cantidad11 = cpcp + cpcd;
              }
              if (ii == 12) {
                this._final.find(x => x.estado === "TOTAL").cantidad12 = cpcp + cpcd;
              }
              if (ii == 13) {
                this._final.find(x => x.estado === "TOTAL").cantidad13 = cpcp + cpcd;
              }

              let c1 = this._final.find(x => x.estado === "TOTAL").total;
              this._final.find(x => x.estado === "TOTAL").total = c1 + cpcp + cpcd;

            }


            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


            this.areas.forEach(
              area => {

                let regproa = {
                  estado: '',
                  cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
                  cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, area: '', total: 0
                }

                //ca = cargos por area
                let ca = documentos.filter(documento => {
                  return documento.envio.buzon.area.id === area.id && documento.recepcionado === false &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                    new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
                }).length;
                
                if (ii == 1) {

                  regproa.area = area.nombre;
                  regproa.estado = area.nombre;
                  regproa.cantidad01 = ca;
                  regproa.total = ca;

                  this._final2.push(regproa);

                } else {
                  if (ii == 2) {
                    this._final2.find(x => x.area === area.nombre).cantidad02 = ca;
                  }
                  if (ii == 3) {
                    this._final2.find(x => x.area === area.nombre).cantidad03 = ca;
                  }
                  if (ii == 4) {
                    this._final2.find(x => x.area === area.nombre).cantidad04 = ca;
                  }
                  if (ii == 5) {
                    this._final2.find(x => x.area === area.nombre).cantidad05 = ca;
                  }
                  if (ii == 6) {
                    this._final2.find(x => x.area === area.nombre).cantidad06 = ca;
                  }
                  if (ii == 7) {
                    this._final2.find(x => x.area === area.nombre).cantidad07 = ca;
                  }
                  if (ii == 8) {
                    this._final2.find(x => x.area === area.nombre).cantidad08 = ca;
                  }
                  if (ii == 9) {
                    this._final2.find(x => x.area === area.nombre).cantidad09 = ca;
                  }
                  if (ii == 10) {
                    this._final2.find(x => x.area === area.nombre).cantidad10 = ca;
                  }
                  if (ii == 11) {
                    this._final2.find(x => x.area === area.nombre).cantidad11 = ca;
                  }
                  if (ii == 12) {
                    this._final2.find(x => x.area === area.nombre).cantidad12 = ca;
                  }
                  if (ii == 13) {
                    this._final2.find(x => x.area === area.nombre).cantidad13 = ca;
                  }

                  let c1 = this._final2.find(x => x.area === area.nombre).total;
                  this._final2.find(x => x.area === area.nombre).total = c1 + ca;

                }
              }
            )



            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            let regtotal2 = {
              estado: '',
              cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0, cantidad06: 0,
              cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, nombre: '', total: 0
            }

            //cm = cargos por mes
            let cm = documentos.filter(documento => {
              return documento.recepcionado === false &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
            }).length;

            if (ii == 1) {
              regtotal2.nombre = "TOTALITO";
              regtotal2.estado = "TOTAL";
              regtotal2.cantidad01 = cm;
              regtotal2.total = cm;
              this._final2.push(regtotal2);
            }
            else {
              if (ii == 2) {
                this._final2.find(x => x.estado === "TOTAL").cantidad02 = cm;
              }
              if (ii == 3) {
                this._final2.find(x => x.estado === "TOTAL").cantidad03 = cm;
              }
              if (ii == 4) {
                this._final2.find(x => x.estado === "TOTAL").cantidad04 = cm;
              }
              if (ii == 5) {
                this._final2.find(x => x.estado === "TOTAL").cantidad05 = cm;
              }
              if (ii == 6) {
                this._final2.find(x => x.estado === "TOTAL").cantidad06 = cm;
              }
              if (ii == 7) {
                this._final2.find(x => x.estado === "TOTAL").cantidad07 = cm;
              }
              if (ii == 8) {
                this._final2.find(x => x.estado === "TOTAL").cantidad08 = cm;
              }
              if (ii == 9) {
                this._final2.find(x => x.estado === "TOTAL").cantidad09 = cm;
              }
              if (ii == 10) {
                this._final2.find(x => x.estado === "TOTAL").cantidad10 = cm;
              }
              if (ii == 11) {
                this._final2.find(x => x.estado === "TOTAL").cantidad11 = cm;
              }
              if (ii == 12) {
                this._final2.find(x => x.estado === "TOTAL").cantidad12 = cm;
              }
              if (ii == 13) {
                this._final2.find(x => x.estado === "TOTAL").cantidad13 = cm;
              }

              let c2 = this._final2.find(x => x.estado === "TOTAL").total;
              this._final2.find(x => x.estado === "TOTAL").total = c2 + cm;

            }



            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            let mes = {
              id: 0,
              nombre: ""
            }

            mes.id = ii;
            mes.nombre = this.utilsService.getNombreMes(fechaInicial);
            this.meses.push(mes);


            ii++;
            mIni++;
            if (mIni >= 13) {
              fechaInicial = new Date(moment(new Date(fi.getFullYear() + 1, 0, 1), "DD-MM-YYYY HH:mm:ss"));
            }
            else {
              fechaInicial.setMonth(mIni);
            }

            aIni = fechaInicial.getFullYear();
            mIni = fechaInicial.getMonth();

          }

          

          this._registros = this._final.map(function (obj) {
            return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.total];
          });

          this._registros2 = this._final2.map(function (obj) {
            return [obj.estado, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.total];
          });


        },
        error => {
          if (error.status === 400) {
            this.notifier.notify('error', 'RANGOS DE FECHA NO VALIDA');
          }
        }
      );

    }
    else {
      this.notifier.notify('error', 'SELECCIONE RANGO DE FECHAS');
    }


  }



}
