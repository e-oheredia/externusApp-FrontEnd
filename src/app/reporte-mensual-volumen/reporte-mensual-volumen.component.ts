import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';

@Component({
    selector: 'app-reporte-mensual-volumen',
    templateUrl: './reporte-mensual-volumen.component.html',
    styleUrls: ['./reporte-mensual-volumen.component.css']
})
export class ReporteMensualVolumenComponent implements OnInit {

    constructor(
        public documentoService: DocumentoService,
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public proveedorService: ProveedorService) {

    }


    proveedores: Proveedor[];
    documentos = [];
    reporte = [];
    documentosSubscription: Subscription;
    documentoForm: FormGroup;
    dataSource = [];


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
        this.dataSource = [];
        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENVIADO).subscribe(
                documentos => {

                    this.documentos = documentos;
                    console.log(this.documentos)
                    this.proveedores.forEach(
                        proveedor => {
                            let reporteProveedor = {
                                proveedor: "",
                                cantidad: 0
                            };
                            reporteProveedor.proveedor = proveedor.nombre;
                            reporteProveedor.cantidad = documentos.filter(documento => 
                                documento.documentosGuia[0].guia.proveedor.id === proveedor.id
                            ).length;
                            this.dataSource.push(reporteProveedor);
                        }
                    );
                    
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


    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }








    /*      PRACTICANDO CON REPORTES    */




    llenarDataSource() {

        // let sede = {
        //     Sede: "La Molida",
        //     cantidad: this.
        // }

        // this.dataSource.push(sede);

    }




    padding: any = { left: 10, top: 20, right: 10, bottom: 20 };
    titlePadding: any = { left: 50, top: 0, right: 0, bottom: 10 };
    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };


    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '100%';
        }

        return 850;
    }


    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR COURIER --------------------------------------------------------------------------------------

    xAxisCourier: any = {
        dataField: 'proveedor',
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

    valueAxisCourier: any = {
        visible: true,
        title: { text: 'Cantidad por Estado' },
        tickMarks: { color: '#BCBCBC' }
    };

    seriesGroupsCourier: any =
        [
            {
                type: 'column',
                columnsGapPercent: 70,
                showLabels: true,
                valueAxis:
                {
                    visible: true,
                    unitInterval: 2,
                    title: { text: 'Cantidadd' },
                    minValue: 0
                },
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'Cantidad'
                        }
                    ]
            }
        ]



    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR UTD ------------------------------------------------------------------------------------------

    source: any = {
        datatype: 'csv',
        datafields: [
            { name: 'Creado' },
            { name: 'Custodiado' }
        ]
    }

    seriesGroupsUtd: any =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'Courier',
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

    seriesGroupsServicio: any =
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
}
