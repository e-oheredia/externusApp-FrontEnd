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
            let mIni = fechaIniDate.getMonth();
            let aIni = fechaIniDate.getFullYear();

            if ((fechaFinDate.getFullYear() - fechaIniDate.getFullYear()) * 12 + (fechaFinDate.getMonth() - fechaIniDate.getMonth()) >= 13) {
                this.notifier.notify('error', 'SELECCIONE COMO MÁXIMO UN PERIODO DE 13 MESES');
                return;
            }


            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoDocumentoEnum.ENTREGADO).subscribe(

                documentos => {

                    this.dataGrafico = [];
                    this.meses = [];
                    this._registros = [];
                    this._final = [];

                    let ii = 1;

                    while ((fechaFinDate.getFullYear() - fechaIniDate.getFullYear()) * 12 + (fechaFinDate.getMonth() - fechaIniDate.getMonth()) >= 0) {

                        this.proveedores.forEach(
                            proveedor => {

                                let reporteFinal = {
                                    proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: "0", cantidad02: "0", cantidad03: "0", cantidad04: "0", cantidad05: "0",
                                    cantidad06: "0", cantidad07: "0", cantidad08: "0", cantidad09: "0", cantidad10: "0", cantidad11: "0", cantidad12: "0", cantidad13: "0", tipoFila: 1, estilo: ""
                                }

                                let c = documentos.filter(documento => {
                                    return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                                        moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                }
                                ).length;

                                let total_mes = documentos.filter(documento => {
                                    return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                        new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()

                                }
                                ).length;


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

                                        let reporteDentro = {
                                            proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                            cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, tipoFila: 1, estilo: ""
                                        }

                                        let reporteFuera = {
                                            proveedor: "", plazoDistribucion: "", eficiencia: "", cantidad01: 0, cantidad02: 0, cantidad03: 0, cantidad04: 0, cantidad05: 0,
                                            cantidad06: 0, cantidad07: 0, cantidad08: 0, cantidad09: 0, cantidad10: 0, cantidad11: 0, cantidad12: 0, cantidad13: 0, tipoFila: 1, estilo: ""
                                        }

                                        let dentro = 0;
                                        let fuera = 0;

                                        dentro = documentos.filter(documento => {
                                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                                documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                                                moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                        }
                                        ).length;


                                        fuera = documentos.filter(documento => {
                                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                                documento.envio.plazoDistribucion.id === plazoDistribucion.id &&
                                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                                                moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') > (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                                        }
                                        ).length;


                                        if (ii == 1) {

                                            reporteDentro.proveedor = proveedor.nombre;
                                            reporteDentro.plazoDistribucion = plazoDistribucion.nombre;
                                            reporteDentro.eficiencia = 'DENTRO';
                                            reporteDentro.cantidad01 = dentro;
                                            this._final.push(reporteDentro);

                                            reporteFuera.proveedor = proveedor.nombre;
                                            reporteFuera.plazoDistribucion = plazoDistribucion.nombre;
                                            reporteFuera.eficiencia = 'FUERA DE PLAZO';
                                            reporteFuera.cantidad01 = fuera;
                                            this._final.push(reporteFuera);

                                        }
                                        else {

                                            if (ii == 2) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad02 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad02 = fuera;
                                            }
                                            if (ii == 3) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad03 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad03 = fuera;
                                            }
                                            if (ii == 4) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad04 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad04 = fuera;
                                            }
                                            if (ii == 5) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad05 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad05 = fuera;
                                            }
                                            if (ii == 6) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad06 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad06 = fuera;
                                            }
                                            if (ii == 7) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad07 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad07 = fuera;
                                            }
                                            if (ii == 8) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad08 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad08 = fuera;
                                            }
                                            if (ii == 9) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad09 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad09 = fuera;
                                            }
                                            if (ii == 10) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad10 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad10 = fuera;
                                            }
                                            if (ii == 11) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad11 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad11 = fuera;
                                            }
                                            if (ii == 12) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad12 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad12 = fuera;
                                            }
                                            if (ii == 13) {
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'DENTRO').cantidad13 = dentro;
                                                this._final.find(x => x.proveedor == proveedor.nombre && x.plazoDistribucion == plazoDistribucion.nombre && x.eficiencia == 'FUERA DE PLAZO').cantidad13 = fuera;
                                            }
                                        }
                                    }
                                )
                            }
                        )


                        let registroGrafico = {
                            mes: "",
                            cantidad: "0"
                        };

                        registroGrafico.mes = this.utilsService.getNombreMes(fechaIniDate);

                        let totales_mes = 0;
                        let eficiencia_mes = 0;


                        eficiencia_mes = documentos.filter(documento => {
                            return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth() &&
                                moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss").diff(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENVIADO).fecha, "DD-MM-YYYY HH:mm:ss"), 'days') <= (documento.envio.plazoDistribucion.tiempoEnvio / 24)
                        }
                        ).length;

                        totales_mes = documentos.filter(documento => {
                            return new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getFullYear() == new Date(fechaIniDate).getFullYear() &&
                                new Date(moment(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO).fecha, "DD-MM-YYYY HH:mm:ss")).getMonth() == new Date(fechaIniDate).getMonth()
                        }
                        ).length;


                        registroGrafico.cantidad = this.Porcentaje(eficiencia_mes, totales_mes);

                        this.dataGrafico.push(registroGrafico);


                        let mes = {
                            id: 0,
                            nombre: ""
                        }
                        mes.id = ii;
                        mes.nombre = this.utilsService.getNombreMes(fechaIniDate);
                        this.meses.push(mes);


                        ii++;
                        mIni++;
                        if (mIni >= 13) {
                            fechaIniDate = new Date(moment(new Date(fechaIniDate.getFullYear() + 1, 0, 1), "DD-MM-YYYY HH:mm:ss"));
                        }
                        else {
                            fechaIniDate.setMonth(mIni);
                        }

                        aIni = fechaIniDate.getFullYear();
                        mIni = fechaIniDate.getMonth();
                    }

                    this._registros = this._final.map(function (obj) {
                        return [obj.plazoDistribucion, obj.cantidad01, obj.cantidad02, obj.cantidad03, obj.cantidad04, obj.cantidad05, obj.cantidad06, obj.cantidad07, obj.cantidad08, obj.cantidad09, obj.cantidad10, obj.cantidad11, obj.cantidad12, obj.cantidad13, obj.proveedor, obj.eficiencia, obj.tipoFila, obj.estilo];
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
