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
        public proveedorService: ProveedorService
    ) { }


    proveedores: Proveedor[];
    documentos = [];
    documentosSubscription: Subscription;
    documentoForm: FormGroup;
    dataSource: any[];
    dataSource2: any[];
    dataSource3: any[];

    sampleData: any[] = [
        { Day: 'Monday', Keith: 30, Erica: 15, George: 25 },
        { Day: 'Tuesday', Keith: 25, Erica: 25, George: 30 },
        { Day: 'Wednesday', Keith: 30, Erica: 20, George: 25 },
        { Day: 'Thursday', Keith: 35, Erica: 25, George: 45 },
        { Day: 'Friday', Keith: 20, Erica: 20, George: 25 },
        { Day: 'Saturday', Keith: 30, Erica: 20, George: 30 },
        { Day: 'Sunday', Keith: 60, Erica: 45, George: 90 }
    ];

    sedeData = [{
        sede: "La Molina", cantidad: 1
    }]


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
    }



    MostrarReportes(fechaIni: Date, fechaFin: Date) {

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENVIADO).subscribe(
                documentos => {

                    this.documentos = documentos;
                    this.llenarDataSource(documentos);

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
    }


    llenarDataSource(documentos: Documento[]) {
        this.dataSource = [];
        this.dataSource2 = [];
        this.dataSource3 = [];

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

                let reporteSede = {
                    sede: 'La Molina',
                    cantidad: 0
                };
                reporteSede.cantidad = documentos.length;
                this.dataSource2.push(reporteSede);

        // this.proveedores.forEach(
        //     proveedor => {
        //         let reporteServicio = {
        //             proveedor: '',
        //             cantidad
        //         }
        //     }
        // )    
            
    }


    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }

    //----------------------------------------------------------------------------------------------------------------------------------

    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };
    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 0, top: 0, right: 0, bottom: 10 };

    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR COURIER --------------------------------------------------------------------------------------

    paddingC: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePaddingC: any = { left: 0, top: 0, right: 0, bottom: 10 };

    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '100%';
        }
        return 850;
    }

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
                            initialAngle: 15,
                            radius: 145,
                            centerOffset: 0,
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

    seriesGroupsUtd: any =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'sede',
                            labelRadius: 170, //acercar o alejar el numero del centro del pie
                            initialAngle: 90,
                            radius: 150, //tamaño del radio
                            centerOffset: 10, //separacion entre secciones del pie
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

    xAxisServicio: any = {
        dataField: 'Estado',
        unitInterval: 1,
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
    };

    valueAxisServicio: any = {
        visible: true,
        title: { text: 'Cantidad por Estado' },
        tickMarks: { color: '#BCBCBC' }
    };

    seriesGroupsSer: any =
        [
            {
                type: 'line',
                valueAxis:
                {
                    visible: true,
                    unitInterval: 2,
                    title: { text: 'Cantidad de Documentos' },
                    minValue: 0
                },
                series: [
                    {
                        dataField: 'cantidad',
                        displayText: 'Línea de comparación'
                    }
                ]
            }
        ]























































        xAxis: any =
        {
            dataField: 'Day',
            type: 'basic'
        };
        seriesGroups: any[] =
        [
            {
                type: 'column',
                valueAxis:
                {
                    minValue: 0,
                    maxValue: 100,
                    unitInterval: 10,
                    title: { text: 'Time in minutes' }
                },
                series: [
                    { dataField: 'Keith', displayText: 'Keith' },
                    { dataField: 'Erica', displayText: 'Erica' },
                    { dataField: 'George', displayText: 'George' }
                ]
            }
        ];
        chartEvent(event: any): any {
            let eventData;
            if (event) {
                if (event.args) {
                    if (event.type == 'toggle') {
                        eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, visible: </b>' + event.args.state + '</div>';
                        return;
                    }
                    eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, Value: </b>' + event.args.elementValue + '</div>';
                } else {
                    eventData = '<div><b>Last Event: </b>' + event.type + '';
                }
                this.eventText.nativeElement.innerHTML = eventData;
            }
        }






}
