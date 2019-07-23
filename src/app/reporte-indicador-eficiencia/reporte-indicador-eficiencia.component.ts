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
    selector: 'app-reporte-indicador-eficiencia',
    templateUrl: './reporte-indicador-eficiencia.component.html',
    styleUrls: ['./reporte-indicador-eficiencia.component.css']
})
export class ReporteIndicadorEficienciaComponent implements OnInit {

    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    proveedores: Proveedor[];
    plazosDistribucion: PlazoDistribucion[];
    data: any[] = [];
    dataGrafico1: any[] = [];
    dataGrafico2: any[] = [];
    validacion: number;
    dataGrafico = [];
    _registros = [];
    _final = [];
    meses = [];

    eficiencia = [{ descripcion: 'DENTRO' }, { descripcion: 'FUERA DE PLAZO' }];

    constructor(
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public documentoService: DocumentoService,
        public proveedorService: ProveedorService,
        private reporteService: ReporteService,
        public plazoDistribucionService: PlazoDistribucionService
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

    Porcentaje(cantidad: number, total: number): string {
        let resultado = (cantidad * 100) / total;
        if (isNaN(resultado)) {
            resultado = 0;
        }
        var final = resultado.toFixed(1) + '%';
        return final;
    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {
        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            let fechaIniDate = new Date(fechaIni);
            let fechaFinDate = new Date(fechaFin);
            fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
            fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());

            this.documentosSubscription = this.reporteService.getindicadoreficiencia(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD')).subscribe(
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
                    })
                    this.llenarDataSource(this.dataGrafico1);
                    this.llenarDataSource2(this.dataGrafico2);
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


    llenarDataSource(data) {
        this.data = data;
        this.dataGrafico = [];
        this.meses = [];
        this._registros = [];
        this._final = [];

        let ii = 1;

        Object.keys(data).forEach(key2 => {
            var obj2 = data[key2];
            Object.keys(obj2).forEach(key3 => {
                let registroGrafico = {
                    mes: "",
                    cantidad: "0"
                };
                registroGrafico.mes = this.utilsService.getNombreMes2(parseInt(key3));
                let numero = obj2[key3];
                let decimal = numero.toFixed(1);
                let porcentaje = decimal + "%";
                registroGrafico.cantidad = porcentaje
                this.dataGrafico.push(registroGrafico);

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



    llenarDataSource2(dataGrafico2) {
        this._registros = [];
        this._final = [];
        this.proveedores.forEach(
            proveedor => {
                let reporteFinal = {
                    proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
                    cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", tipoFila: 1, estilo: ""
                }
                let dentro1 = 0;
                let fuera1 = 0;
                var dentro2 = 0;
                var fuera2 = 0;
                var dentro3 = 0;
                var fuera3 = 0;
                var dentro4 = 0;
                var fuera4 = 0;
                var dentro5 = 0;
                var fuera5 = 0;
                var dentro6 = 0;
                var fuera6 = 0;
                var dentro7 = 0;
                var fuera7 = 0;
                var dentro8 = 0;
                var fuera8 = 0;
                var dentro9 = 0;
                var fuera9 = 0;
                var dentro10 = 0;
                var fuera10 = 0;
                var dentro11 = 0;
                var fuera11 = 0;
                var dentro12 = 0;
                var fuera12 = 0;
                var dentro13 = 0;
                var fuera13 = 0;
                Object.keys(dataGrafico2).forEach(key2 => {
                    var obj2 = dataGrafico2[key2];
                    if (proveedor.id == parseInt(key2)) {

                        reporteFinal.proveedor = proveedor.nombre;
                        reporteFinal.plazoDistribucion = proveedor.nombre;
                        reporteFinal.eficiencia = proveedor.nombre;
                        reporteFinal.tipoFila = 2;
                        reporteFinal.estilo = "proveedor";

                        Object.keys(obj2).forEach(key3 => {
                            var obj3 = obj2[key3];
                            Object.keys(obj3).forEach(key4 => {
                                var obj4 = obj3[key4];
                                Object.keys(obj4).forEach(key5 => {
                                    var obj5 = obj4[key5];
                                    Object.keys(obj5).forEach(key6 => {
                                        var obj6 = obj5[key6];

                                        if (parseInt(key5) == 1) {
                                            if (key6 == "dentroplazo") {
                                                dentro1 = dentro1 + obj6;
                                            } else {
                                                fuera1 = fuera1 + obj6;
                                            }

                                            let valor = dentro1 / (dentro1 + fuera1)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad01 = porcentaje
                                        }
                                        if (parseInt(key5) == 2) {
                                            if (key6 == "dentroplazo") {
                                                dentro2 = dentro2 + obj6;
                                            } else {
                                                fuera2 = fuera2 + obj6;
                                            }

                                            let valor = dentro2 / (dentro2 + fuera2)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad02 = porcentaje;
                                        }
                                        if (parseInt(key5) == 3) {
                                            if (key6 == "dentroplazo") {
                                                dentro3 = dentro3 + obj6;
                                            } else {
                                                fuera3 = fuera3 + obj6;
                                            }

                                            let valor = dentro3 / (dentro3 + fuera3)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad03 = porcentaje;

                                        }
                                        if (parseInt(key5) == 4) {
                                            if (key6 == "dentroplazo") {
                                                dentro4 = dentro4 + obj6;
                                            } else {
                                                fuera4 = fuera4 + obj6;
                                            }

                                            let valor = dentro4 / (dentro4 + fuera4)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad04 = porcentaje;

                                        }
                                        if (parseInt(key5) == 5) {
                                            if (key6 == "dentroplazo") {
                                                dentro5 = dentro5 + obj6;
                                            } else {
                                                fuera5 = fuera5 + obj6;
                                            }

                                            let valor = dentro5 / (dentro5 + fuera5)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad05 = porcentaje;

                                        }
                                        if (parseInt(key5) == 6) {
                                            if (key6 == "dentroplazo") {
                                                dentro6 = dentro6 + obj6;
                                            } else {
                                                fuera6 = fuera6 + obj6;
                                            }

                                            let valor = dentro6 / (dentro6 + fuera6)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad06 = porcentaje;

                                        }
                                        if (parseInt(key5) == 7) {
                                            if (key6 == "dentroplazo") {
                                                dentro7 = dentro7 + obj6;
                                            } else {
                                                fuera7 = fuera7 + obj6;
                                            }

                                            let valor = dentro7 / (dentro7 + fuera7)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad07 = porcentaje;

                                        }
                                        if (parseInt(key5) == 8) {
                                            if (key6 == "dentroplazo") {
                                                dentro8 = dentro8 + obj6;
                                            } else {
                                                fuera8 = fuera8 + obj6;
                                            }

                                            let valor = dentro8 / (dentro8 + fuera8)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad08 = porcentaje;

                                        }
                                        if (parseInt(key5) == 9) {
                                            if (key6 == "dentroplazo") {
                                                dentro9 = dentro9 + obj6;
                                            } else {
                                                fuera9 = fuera9 + obj6;
                                            }

                                            let valor = dentro9 / (dentro9 + fuera9)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad09 = porcentaje;

                                        }
                                        if (parseInt(key5) == 10) {
                                            if (key6 == "dentroplazo") {
                                                dentro10 = dentro10 + obj6;
                                            } else {
                                                fuera10 = fuera10 + obj6;
                                            }

                                            let valor = dentro10 / (dentro10 + fuera10)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad10 = porcentaje;

                                        }
                                        if (parseInt(key5) == 11) {
                                            if (key6 == "dentroplazo") {
                                                dentro11 = dentro11 + obj6;
                                            } else {
                                                fuera11 = fuera11 + obj6;
                                            }

                                            let valor = dentro11 / (dentro11 + fuera11)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad11 = porcentaje;

                                        }
                                        if (parseInt(key5) == 12) {
                                            if (key6 == "dentroplazo") {
                                                dentro12 = dentro12 + obj6;
                                            } else {
                                                fuera12 = fuera12 + obj6;
                                            }

                                            let valor = dentro12 / (dentro12 + fuera12)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            if (dentro12 + fuera12) {
                                                reporteFinal.cantidad12 = porcentaje;
                                            }

                                        }
                                        if (parseInt(key5) == 13) {
                                            if (key6 == "dentroplazo") {
                                                dentro13 = dentro13 + obj6;
                                            } else {
                                                fuera13 = fuera13 + obj6;
                                            }

                                            let valor = dentro13 / (dentro13 + fuera13)
                                            if (isNaN(valor)) {
                                                valor = 0
                                            }
                                            let porciento = valor * 100
                                            let decimal = porciento.toFixed(1)
                                            let porcentaje = decimal + "%"

                                            reporteFinal.cantidad13 = porcentaje;
                                        }
                                    });
                                });
                            });
                        });
                        reporteFinal.estilo = "proveedor";
                        this._final.push(reporteFinal);
                    }
                });
                Object.keys(dataGrafico2).forEach(keyn1 => {
                    this.plazosDistribucion.forEach(
                        plazos => {

                            let reporteDentro = {
                                proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, tipoFila: 1, estilo: ""
                            }

                            let reporteFuera = {
                                proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, tipoFila: 1, estilo: ""
                            }

                            reporteDentro.proveedor = proveedor.nombre;
                            reporteDentro.plazoDistribucion = plazos.nombre + " (" + plazos.regiones[0].nombre + ")";
                            reporteDentro.eficiencia = 'DENTRO';

                            reporteFuera.proveedor = proveedor.nombre;
                            reporteFuera.plazoDistribucion = plazos.nombre + " (" + plazos.regiones[0].nombre + ")";
                            reporteFuera.eficiencia = 'FUERA DE PLAZO';

                            if (proveedor.id == parseInt(keyn1)) {

                                var objn1 = dataGrafico2[keyn1];
                                let numerototal = 0;
                                Object.keys(objn1).forEach(keyn2 => {
                                    if (plazos.id == parseInt(keyn2)) {
                                        let dato = 0;

                                        var objn2 = objn1[keyn2];
                                        Object.keys(objn2).forEach(keyn3 => {
                                            var objn3 = objn2[keyn3];
                                            Object.keys(objn3).forEach(keyn4 => {
                                                var objn4 = objn3[keyn4];
                                                Object.keys(objn4).forEach(keyn5 => {
                                                    var obj6 = objn4[keyn5];
                                                    if (parseInt(keyn4) == 1) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad01 = reporteDentro.cantidad01 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad01 = reporteFuera.cantidad01 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 2) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad02 = reporteDentro.cantidad02 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad02 = reporteFuera.cantidad02 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 3) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad03 = reporteDentro.cantidad03 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad03 = reporteFuera.cantidad03 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 4) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad04 = reporteDentro.cantidad04 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad04 = reporteFuera.cantidad04 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 5) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad05 = reporteDentro.cantidad05 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad05 = reporteFuera.cantidad05 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 6) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad06 = reporteDentro.cantidad06 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad06 = reporteFuera.cantidad06 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 7) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad07 = reporteDentro.cantidad07 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad07 = reporteFuera.cantidad07 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 8) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad08 = reporteDentro.cantidad08 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad08 = reporteFuera.cantidad08 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 9) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad09 = reporteDentro.cantidad09 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad09 = reporteFuera.cantidad09 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 10) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad10 = reporteDentro.cantidad10 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad10 = reporteFuera.cantidad10 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 11) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad11 = reporteDentro.cantidad11 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad11 = reporteFuera.cantidad11 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 12) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad12 = reporteDentro.cantidad12 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad12 = reporteFuera.cantidad12 + obj6;
                                                        }
                                                    }
                                                    if (parseInt(keyn4) == 13) {
                                                        if (keyn5 == "dentroplazo") {
                                                            reporteDentro.cantidad13 = reporteDentro.cantidad13 + obj6;
                                                        } else {
                                                            reporteFuera.cantidad13 = reporteFuera.cantidad13 + obj6;
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    }
                                });
                                numerototal = reporteFuera.cantidad01 + reporteDentro.cantidad01 + reporteFuera.cantidad02 + reporteDentro.cantidad02 + reporteFuera.cantidad03 + reporteDentro.cantidad03 + reporteFuera.cantidad04 + reporteDentro.cantidad04 + reporteFuera.cantidad05 + reporteDentro.cantidad05 + reporteFuera.cantidad06 + reporteDentro.cantidad06 + reporteFuera.cantidad07 + reporteDentro.cantidad07 + reporteFuera.cantidad08 + reporteDentro.cantidad08 + reporteFuera.cantidad09 + reporteDentro.cantidad09 + reporteFuera.cantidad10 + reporteDentro.cantidad10 + reporteFuera.cantidad11 + reporteDentro.cantidad11 + reporteFuera.cantidad12 + reporteDentro.cantidad12 + reporteFuera.cantidad13 + reporteDentro.cantidad13;
                                if (numerototal > 0) {
                                    reporteFinal.estilo = "proveedor";
                                    this._final.push(reporteDentro);
                                    this._final.push(reporteFuera);
                                }
                            }
                        });
                });
            });
        this._registros = this._final.map(function (obj) {
            return [obj.plazoDistribucion, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.eficiencia, obj.tipoFila, obj.estilo];
        });

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
            unitInterval: 10,
            minValue: 0,
            maxValue: 110,
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
