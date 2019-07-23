import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import * as moment from 'moment-timezone';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { ReporteService } from '../shared/reporte.service';

@Component({
    selector: 'app-reporte-indicador-volumen',
    templateUrl: './reporte-indicador-volumen.component.html',
    styleUrls: ['./reporte-indicador-volumen.component.css']
})
export class ReporteIndicadorVolumenComponent implements OnInit {

    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    proveedores: Proveedor[];
    plazosDistribucion: PlazoDistribucion[];
    validacion: number;
    data: any[] = [];
    dataGrafico = [];
    _registros = [];
    _final = [];
    meses = [];

    constructor(
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public documentoService: DocumentoService,
        public proveedorService: ProveedorService,
        public plazoDistribucionService: PlazoDistribucionService,
        public reporteService: ReporteService
    ) { }

    ngOnInit() {
        this.validacion = 0;
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
        this.plazoDistribucionService.listarPlazosDistribucionAll().subscribe(
            plazos => {
                this.plazosDistribucion = plazos;
            }
        );
        this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
            plazosDistribucion => {
                this.plazosDistribucion = plazosDistribucion;
            }
        )
    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {
        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
            let fechaIniDate = new Date(fechaIni);
            let fechaFinDate = new Date(fechaFin);
            fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
            fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());

            this.documentosSubscription = this.reporteService.getindicadorvolumen(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD')).subscribe(
                data => {
                    this.validacion = 1;
                    this.data = data;
                    this.dataGrafico = [];
                    this.meses = [];
                    this._registros = [];
                    this._final = [];

                    let ii = 1;
                    Object.keys(data).forEach(key1 => {
                        if (1 === parseInt(key1)) {
                            var obj1 = data[key1];
                            Object.keys(obj1).forEach(key2 => {
                                var obj2 = obj1[key2];
                                Object.keys(obj2).forEach(key3 => {
                                    let registroGrafico = {
                                        mes: "",
                                        cantidad: 0
                                    };
                                    registroGrafico.mes = this.utilsService.getNombreMes2(parseInt(key3));
                                    registroGrafico.cantidad = obj2[key3];
                                    this.dataGrafico.push(registroGrafico);
                                    let mes = {
                                        id: 0,
                                        nombre: ""
                                    }
                                    mes.id = parseInt(key3);
                                    mes.nombre = this.utilsService.getNombreMes2(parseInt(key3));//this.NombreMes(fechaInicial);
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
                                        proveedor: "", plazoDistribucion: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                        cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, estilo: ""
                                    }
                                    reporteFinal.proveedor = proveedor.nombre;
                                    reporteFinal.plazoDistribucion = proveedor.nombre;
                                    var obj1 = data[key1];
                                    Object.keys(obj1).forEach(key2 => {
                                        var obj2 = obj1[key2];
                                        if (proveedor.id == parseInt(key2)) {
                                            Object.keys(obj2).forEach(key3 => {
                                                var obj3 = obj2[key3];
                                                Object.keys(obj3).forEach(key4 => {
                                                    if (parseInt(key4) == 1) {
                                                        reporteFinal.cantidad01 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 2) {
                                                        reporteFinal.cantidad02 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 3) {
                                                        reporteFinal.cantidad03 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 4) {
                                                        reporteFinal.cantidad04 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 5) {
                                                        reporteFinal.cantidad05 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 6) {
                                                        reporteFinal.cantidad06 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 7) {
                                                        reporteFinal.cantidad07 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 8) {
                                                        reporteFinal.cantidad08 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 9) {
                                                        reporteFinal.cantidad09 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 10) {
                                                        reporteFinal.cantidad10 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 11) {
                                                        reporteFinal.cantidad11 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 12) {
                                                        reporteFinal.cantidad12 = obj3[key4];
                                                    }
                                                    if (parseInt(key4) == 13) {
                                                        reporteFinal.cantidad13 = obj3[key4];
                                                    }
                                                });
                                            });
                                        }
                                    });
                                    reporteFinal.estilo = "proveedor";
                                    this._final.push(reporteFinal);
                                    Object.keys(this.data).forEach(keyn1 => {
                                        if (2 === parseInt(keyn1)) {
                                            this.plazosDistribucion.forEach(
                                                plazoDistribucion => {
                                                    let reporteFinal = {
                                                        proveedor: "", plazoDistribucion: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                                        cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, estilo: ""
                                                    }
                                                    reporteFinal.proveedor = proveedor.nombre;
                                                    reporteFinal.plazoDistribucion = plazoDistribucion.nombre + " " + "(" + plazoDistribucion.regiones[0].nombre + ")";
                                                    var objn1 = this.data[keyn1];
                                                    let suma = 0;
                                                    Object.keys(objn1).forEach(keyn2 => {
                                                        if (proveedor.id == parseInt(keyn2)) {
                                                            var objn2 = objn1[keyn2];
                                                            Object.keys(objn2).forEach(keyn3 => {
                                                                var objn3 = objn2[keyn3];
                                                                if (plazoDistribucion.id == parseInt(keyn3)) {
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
                                                                    suma = reporteFinal.cantidad01 + reporteFinal.cantidad02 + reporteFinal.cantidad03 + reporteFinal.cantidad04 + reporteFinal.cantidad05 + reporteFinal.cantidad06 + reporteFinal.cantidad07 + reporteFinal.cantidad08 + reporteFinal.cantidad09 + reporteFinal.cantidad10 + reporteFinal.cantidad11 + reporteFinal.cantidad12 + reporteFinal.cantidad13;
                                                                }
                                                            });
                                                        }
                                                    });
                                                    if (suma > 0) {
                                                        reporteFinal.estilo = "";
                                                        this._final.push(reporteFinal);
                                                    }
                                                }
                                            );
                                        }
                                    });
                                });
                            this._registros = this._final.map(function (obj) {
                                return [obj.plazoDistribucion, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.estilo];
                            });
                        }
                    });
                },
                error => {
                    if (error.status === 409) {
                        this.validacion = 2;
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
            this.validacion = 0;
        }
    }



    padding: any = { left: 10, top: 10, right: 15, bottom: 10 };
    titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }
        return '100%';
    }

    xAxis: any =
        {
            dataField: 'mes',
            unitInterval: 1,
            tickMarks: { visible: true, interval: 1 },
            gridLines: { visible: false },
            gridLinesInterval: { visible: true, interval: 1 },
            valuesOnTicks: false,
            padding: { bottom: 10 }
        };
    valueAxis: any =
        {
            minValue: 0,
            maxValue: 'auto',
            title: { text: 'Volumen de documentos<br><br>' },
            labels: { horizontalAlignment: 'right' }
        };
    seriesGroups: any[] =
        [
            {
                type: 'line',
                series:
                    [
                        {
                            dataField: 'cantidad',
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
        ];


        
}