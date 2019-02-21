import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { Documento } from 'src/model/documento.model';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { Sede } from 'src/model/sede.model';
import { SedeDespachoService } from '../shared/sededespacho.service';
import { Envio } from 'src/model/envio.model';

@Component({
    selector: 'app-reporte-mensual-volumen',
    templateUrl: './reporte-mensual-volumen.component.html',
    styleUrls: ['./reporte-mensual-volumen.component.css']
})
export class ReporteMensualVolumenComponent implements OnInit {

    @ViewChild('eventText') eventText: ElementRef;

    constructor(
        public documentoService: DocumentoService,
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public proveedorService: ProveedorService,
        public sedeDespachoService: SedeDespachoService,
        private plazoDistribucionService: PlazoDistribucionService
    ) { }

    plazos: PlazoDistribucion[];
    envios: Envio;
    sedesDespacho: Sede[];
    proveedores: Proveedor[];
    documentos: Documento[] = [];
    // reportesEficienciaPorPlazoDistribucion: any = {};
    documentosSubscription: Subscription;
    documentoForm: FormGroup;
    dataSource: any[];
    dataSource2: any[];
    dataSource3: any[];


    ngOnInit() {
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
        })

        this.proveedores = this.proveedorService.getProveedores();

        this.sedesDespacho = this.sedeDespachoService.getSedesDespacho();

        this.proveedorService.proveedoresChanged.subscribe(
            proveedores => {
                this.proveedores = proveedores;
            }
        )

        this.sedeDespachoService.sedesDespachoChanged.subscribe(
            sedesDespacho => {
                this.sedesDespacho = sedesDespacho;
            }
        )

        this.plazos = this.plazoDistribucionService.getPlazosDistribucion();
        this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
            plazos => {
                this.plazos = plazos;
            }
        )
    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENVIADO).subscribe(
                documentos => {

                    this.documentos = documentos;
                    this.llenarDataSource(documentos);
                    this.llenarDataSource2(documentos);
                    this.llenarDatasource3(documentos);

                },
                error => {
                    if (error.status === 400) {
                        this.documentos = [];
                        this.notifier.notify('error', 'RANGOs DE FECHA NO VALIDA');
                    }
                }
            );
        }
        else {
            this.notifier.notify('error', 'SELECCIONE RANGO DE FECHAS');
        }
        
        console.log(this.proveedores);
        console.log(this.sedesDespacho);
    }


    llenarDataSource(documentos: Documento[]) {
        this.dataSource = [];

        this.proveedores.forEach(
            proveedor => {
                let reporteProveedor = {
                    proveedor: '',
                    cantidad: 0
                };
                reporteProveedor.proveedor = proveedor.nombre;
                reporteProveedor.cantidad = documentos.filter(
                    documento =>
                        documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length;
                this.dataSource.push(reporteProveedor);
            }
        )
    }

    llenarDataSource2(documentos: Documento[]) {
        this.dataSource2 = [];

        this.sedesDespacho.forEach(
            sedeDespacho => {
                let reporteSedeDespacho = {
                    sedeDespacho: '',
                    cantidad: 0
                };
                reporteSedeDespacho.sedeDespacho = sedeDespacho.nombre;
                reporteSedeDespacho.cantidad = documentos.filter(documento =>
                    documento.envio.sede.id === sedeDespacho.id).length;

                this.dataSource2.push(reporteSedeDespacho);
            }
        )


        // let reporteSede = {
        //     sede: 'La Molina',
        //     cantidad: 0
        // };
        // reporteSede.cantidad = documentos.length;
        // this.dataSource2.push(reporteSede);

    }



    llenarDatasource3(documentos: Documento[]) {
        this.dataSource3 = [];
        this.proveedores.forEach(
            proveedor => {
                let graficoPorProveedor: any[] = [];
                proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(
                    plazoDistribucion => {
                        let graficoPorProveedorObjeto = {
                            plazo: plazoDistribucion.tiempoEnvio + ' H',
                            cantidad: documentos.filter(documento =>
                                documento.documentosGuia[0].guia.proveedor.id===proveedor.id &&
                                documento.envio.plazoDistribucion.id === plazoDistribucion.id).length
                        }
                        graficoPorProveedor.push(graficoPorProveedorObjeto);
                    });
                this.dataSource3[proveedor.nombre] = graficoPorProveedor;
            }
        )

    }


    porcentajeAsignado(proveedor) {
        var porcentaje = 100;
        var total = this.documentos.length;
        var courierDoc = this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length;
        var numero = (courierDoc * porcentaje) / total
        var final = numero.toFixed(1);
        return final +'%';
    }


    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }

    //----------------------------------------------------------------------------------------------------------------------------------

    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };
    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 0, top: 0, right: 0, bottom: 10 };

    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '60%';
        }
        return 850;
    }

    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR COURIER --------------------------------------------------------------------------------------

    paddingC: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePaddingC: any = { left: 0, top: 0, right: 0, bottom: 10 };

    seriesGroupsPro: any[] =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'proveedor',
                            labelRadius: 170,
                            initialAngle: 90,
                            radius: 145,
                            centerOffset: 2,
                            formatFunction: (value: any) => {
                                if (isNaN(value))
                                    return value;
                                return parseFloat(value);
                                // return parseFloat(value) + '%';
                            },
                        }
                    ]
            }
        ];

    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR UTD ------------------------------------------------------------------------------------------

    paddingU: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePaddingU: any = { left: 0, top: 0, right: 0, bottom: 10 };

    seriesGroupsUtd: any[] =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'sedeDespacho',
                            labelRadius: 170, //acercar o alejar el numero del centro del pie
                            initialAngle: 90,
                            radius: 145, //tamaño del radio
                            centerOffset: 2, //separacion entre secciones del pie
                            // formatSettings: { sufix: '%', decimalPlaces: 1 } //formato de porcentaje
                            formatFunction: (value: any) => {
                                if (isNaN(value))
                                    return value;
                                return parseFloat(value);
                                // return parseFloat(value) + '%';
                            }

                        }
                    ]
            }
        ]

    // VOLUMEN DE DISTRIBUCIÓN - BAR - POR TIPO DE SERVICIO -----------------------------------------------------------------------------

    paddingS: any = { left: 20, top: 5, right: 20, bottom: 5 };
    titlePaddingS: any = { left: 90, top: 0, right: 0, bottom: 10 };

    getAxis(dataField: string) {
        return {

            dataField: dataField,
            unitInterval: 1,
            axisSize: 'auto',
            tickMarks: {
                visible: true,
                interval: 1,
                color: '#CACACA'
            },
            gridLines: {
                visible: true, //mostrar linea vertical 
                interval: 1, //cada "N" espacios
                color: '#BCBCBC'
            }
        }
    }

    getValueAxis(title: string, flip = false) {
        return {
            visible: true,
            flip: flip,
            title: { text: title },
            tickMarks: { color: '#BCBCBC' },
            labels: { horizontalAlignment: 'left' },
            minValue: 0,
            unitInterval: 1
        }
    }

    getSeriesGroups(type: string, datas: any[], orientation = 'vertical') {
        let series: any[] = [];
        datas.forEach(data => {
            let keys: string[] = Object.keys(data);
            if (keys.length == 1) {
                series.push({
                    dataField: keys[0],
                    displayText: data[keys[0]],
                    showLabels:true
                })
            } else {
                series.push({
                    dataField: keys[0],
                    displayText: data[keys[0]],
                    colorFunction: (value, itemIndex) => {
                        if (data['indiceReporte'] < itemIndex) {
                            return '#fff655';
                        }
                        return '#55CC55';
                    },
                    showLabels:true
                })
            }
        });


        return [
            {
                type: type,
                orientation: orientation,
                series: series,
                columnsMinWidth: 20,
                columnsMaxWidth: 30,
             }
        ]
    }



}
