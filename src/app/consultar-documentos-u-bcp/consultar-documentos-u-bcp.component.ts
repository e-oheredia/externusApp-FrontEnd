import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';

@Component({
    selector: 'app-consultar-documentos-u-bcp',
    templateUrl: './consultar-documentos-u-bcp.component.html',
    styleUrls: ['./consultar-documentos-u-bcp.component.css']
})

export class ConsultarDocumentosUBCPComponent implements OnInit {

    constructor(public documentoService: DocumentoService,
        private notifier: NotifierService,
        private utilsService: UtilsService) {

    }


    documentos = [];
    documentosSubscription: Subscription;
    documentoForm: FormGroup;

    ngOnInit() {
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
        })
    }


    listarDocumentos(fechaIni: Date, fechaFin: Date) {

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {


            this.documentosSubscription = this.documentoService.listarDocumentosUsuarioBCP(fechaIni, fechaFin).subscribe(
                documentos => {
                    this.documentos = documentos;
                    this.llenarDataSource();
                },
                error => {
                    if (error.status === 400) {
                        this.documentos = [];
                        this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
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


    dataSource = [];

    llenarDataSource() {
        this.dataSource = [];

        let documentoCreado = {
            Estado: "Creado",
            cantidad: this.documentos.filter(
                documento => this.documentoService.getUltimoEstado(documento).id === 1).length
        }

        let documentoCustodiado = {
            Estado: "Custodiado",
            cantidad: this.documentos.filter(
                documento => this.documentoService.getUltimoEstado(documento).id === 2).length
        }

        this.dataSource.push(documentoCreado);
        this.dataSource.push(documentoCustodiado);
    }


    padding: any = { left: 10, top: 5, right: 10, bottom: 5 };
    titlePadding: any = { left: 50, top: 0, right: 0, bottom: 10 };
    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };


    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '98%';
        }

        return 850;
    }

    xAxis: any = {
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

    valueAxis: any = {
        visible: true,
        title: { text: 'Cantidad por Estado' },
        tickMarks: { color: '#BCBCBC' }
    };







    seriesGroupsLine: any =
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




    seriesGroupsColumn: any =
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
                series: [
                    {
                        dataField: 'cantidad',
                        displayText: 'Cantidad'
                    }
                ]
            }
        ]



    seriesGroupsPie: any = 
    [
        {
            type: 'pie',
            showLabels: true,
            series: 
            [
                {
                dataField: 'cantidad',
                displayText: 'Proveedor',
                labelRadius: 170, //acercar o alejar el numero del centro del pie
                initialAngle: 90,
                radius: 150, //tamaño del radio
                centerOffset: 10, //separacion entre secciones del pie
                formatSettings: { sufix: '%', decimalPlaces: 1 } //formato de porcentaje

                // formatFunction: function (value, itemIndex) {

                //     return DataSource;
                // },
                // toolTipFormatFunction: function (value, itemIndex) {
                //     var label = DataSource + ': ' + DataSource + '%';
                //     return label;
                // }
                }
            ]
        }
    ]





}