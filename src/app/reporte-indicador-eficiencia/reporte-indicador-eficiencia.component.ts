import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import * as moment from 'moment-timezone';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { forEach } from '@angular/router/src/utils/collection';
import { registerContentQuery } from '@angular/core/src/render3/instructions';
import { EstadoDocumento } from 'src/model/estadodocumento.model';

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
        public plazoDistribucionService: PlazoDistribucionService

    ) { }

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

        this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
        this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
            plazosDistribucion => {
                this.plazosDistribucion = plazosDistribucion;
            }
        )
    }


    NombreMes(mes: Date) {
        var month = new Array();
        month[0] = "Enero";
        month[1] = "Febrero";
        month[2] = "Marzo";
        month[3] = "Abril";
        month[4] = "Mayo";
        month[5] = "Junio";
        month[6] = "Julio";
        month[7] = "Agosto";
        month[8] = "Septiembre";
        month[9] = "Octubre";
        month[10] = "Noviembre";
        month[11] = "Diciembre";
        return month[mes.getMonth()];
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

        //console.log((aFin - aIni) * 12 + (mFin - mIni));

        if ((aFin - aIni) * 12 + (mFin - mIni) >= 13) {
            this.notifier.notify('error', 'SELECCIONE COMO MÁXIMO UN PERIODO DE 13 MESES');
            return;
        }

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENTREGADO).subscribe(
                documentos => {

                    this.dataGrafico = [];
                    this.meses = [];
                    this._registros = [];
                    this._final = [];


                    let ii = 1;

                    while (((aFin - aIni) * 12 + (mFin - mIni)) >= 0) {

                        this.proveedores.forEach(
                            proveedor => {

                                let reporteFinal = {
                                    proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
                                    cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", tipoFila: 1, estilo : ""
                                }

                                let c = documentos.filter(documento => {
                                    return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth() &&
                                        moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                }
                                ).length;

                                let total_mes = documentos.filter(documento => {
                                    console.log(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"),'days'));
                                    return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth() &&
                                        moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                }
                                ).length;

                                
                                console.log(c);
                                console.log(total_mes);
                                if (ii == 1) {

                                    reporteFinal.proveedor = proveedor.nombre;
                                    reporteFinal.plazoDistribucion = proveedor.nombre;
                                    reporteFinal.eficiencia = proveedor.nombre;
                                    reporteFinal.cantidad01 = this.Porcentaje(c, total_mes);
                                    reporteFinal.tipoFila = 2;
                                    reporteFinal.estilo = "proveedor"

                                    this._final.push(reporteFinal);
                                }
                                else {

                                    if (ii == 2) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad02 = this.Porcentaje(c, total_mes);
                                    if (ii == 3) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad03 = this.Porcentaje(c, total_mes);
                                    if (ii == 4) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad04 = this.Porcentaje(c, total_mes);
                                    if (ii == 5) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad05 = this.Porcentaje(c, total_mes);
                                    if (ii == 6) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad06 = this.Porcentaje(c, total_mes);
                                    if (ii == 7) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad07 = this.Porcentaje(c, total_mes);
                                    if (ii == 8) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad08 = this.Porcentaje(c, total_mes);
                                    if (ii == 9) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad09 = this.Porcentaje(c, total_mes);
                                    if (ii == 10) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad10 = this.Porcentaje(c, total_mes);
                                    if (ii == 11) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad11 = this.Porcentaje(c, total_mes);
                                    if (ii == 12) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad12 = this.Porcentaje(c, total_mes);
                                    if (ii == 13) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == proveedor.nombre).cantidad13 = this.Porcentaje(c, total_mes);

                                    

                                }



                                this.plazosDistribucion.forEach(
                                    plazoDistribucion => {





                                        this.eficiencia.forEach(

                                            eficiencia => {

                                                let reporteFinal = {
                                                    proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                                    cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, tipoFila : 1, estilo : ""
                                                }

                                                c = 0;

                                                if (eficiencia.descripcion == 'DENTRO') {

                                                    c = documentos.filter(documento => {
                                                        return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                                            documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                                                            new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                                            new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth() &&
                                                            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                                    }
                                                    ).length;
                                                }
                                                else {

                                                    c = documentos.filter(documento => {
                                                        return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                                            documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                                                            new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                                            new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth() &&
                                                            moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') > (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                                    }
                                                    ).length;
                                                }





                                                if (ii == 1) {

                                                    reporteFinal.proveedor = proveedor.nombre;
                                                    reporteFinal.plazoDistribucion = plazoDistribucion.nombre;
                                                    reporteFinal.eficiencia = eficiencia.descripcion;
                                                    reporteFinal.cantidad01 = c;

                                                    this._final.push(reporteFinal);

                                                }
                                                else {
                                                    console.log(this._final);
                                                    console.log(eficiencia.descripcion);
                                                    console.log("hola");
                                                    if (ii == 2) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad02 = c;
                                                    if (ii == 3) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad03 = c;
                                                    if (ii == 4) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad04 = c;
                                                    if (ii == 5) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad05 = c;
                                                    if (ii == 6) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad06 = c;
                                                    if (ii == 7) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad07 = c;
                                                    if (ii == 8) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad08 = c;
                                                    if (ii == 9) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad09 = c;
                                                    if (ii == 10) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad10 = c;
                                                    if (ii == 11) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad11 = c;
                                                    if (ii == 12) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad12 = c;
                                                    if (ii == 13) this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == eficiencia.descripcion).cantidad13 = c;

                                                }


                                            }

                                        )





                                    }

                                )

                            }
                        )


                        let registroGrafico = {
                            mes: "",
                            cantidad: "0"
                        };

                        
                        registroGrafico.mes = this.NombreMes(fechaInicial);

                        let totales_mes = 0;
                        let eficiencia_mes = 0;


                        eficiencia_mes = documentos.filter(documento => {
                            return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth() &&
                                moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                        }
                        ).length;

                        totales_mes = documentos.filter(documento => {
                            return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaInicial).getFullYear() &&
                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 3).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaInicial).getMonth()
                        }
                        ).length;


                        registroGrafico.cantidad = this.Porcentaje(eficiencia_mes, totales_mes);

                        this.dataGrafico.push(registroGrafico);


                        let mes = {
                            id: 0,
                            nombre: ""
                        }
                        mes.id = ii;
                        mes.nombre = this.NombreMes(fechaInicial);
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
                        return [obj.plazoDistribucion, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.eficiencia,obj.tipoFila,obj.estilo];
                    });

                    let kk: number = 0;

                    console.log(this.dataGrafico);
                    console.log(this.meses);
                    console.log(this._final);
                    console.log(this._registros);

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
            gridLinesInterval: { visible: true, interval: 1 },
            valuesOnTicks: false,
            padding: { bottom: 10 }
        };
    valueAxis: any =
        {
            unitInterval: 5,
            minValue: 0,
            maxValue: 50,
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