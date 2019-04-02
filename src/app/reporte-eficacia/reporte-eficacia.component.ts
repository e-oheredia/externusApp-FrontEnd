import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { EstadoDocumentoService } from '../shared/estadodocumento.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { EstadoDocumento } from '../../model/estadodocumento.model';


@Component({
    selector: 'app-reporte-eficacia',
    templateUrl: './reporte-eficacia.component.html',
    styleUrls: ['./reporte-eficacia.component.css']
})

export class ReporteEficaciaComponent implements OnInit {

    constructor(
        public documentoService: DocumentoService,
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public proveedorService: ProveedorService,
        public estadoDocumentoService: EstadoDocumentoService) {
    }

    dataSource = [];
    proveedores: Proveedor[] = [];
    documentos = [];

    documentosSubscription: Subscription;
    documentoForm: FormGroup;
    estadoDoc: EstadoDocumento[] = [];

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
        this.estadoDoc = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor();
        this.estadoDoc.push({
            id: EstadoDocumentoEnum.ENVIADO,
            nombre: "PENDIENTE DE ENTREGA",
            estadosDocumentoPermitidos: [],
            motivos: []
        })
        
        this.estadoDocumentoService.estadosDocumentoResultadosProveedorChanged.subscribe(
            estados => {
                this.estadoDoc = estados;
                this.estadoDoc.push({
                    id: EstadoDocumentoEnum.ENVIADO,
                    nombre: "PENDIENTE DE ENTREGA",
                    estadosDocumentoPermitidos: [],
                    motivos: []
                })
            }
        )


    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENVIADO).subscribe(
                documentos => {
                    this.dataSource = [];
                    this.documentos = documentos;

                    this.estadoDoc.forEach(
                        estado => {
                            let reporteEficacia = {
                                estado: estado.nombre
                            };

                            this.proveedores.forEach(
                                proveedor => {

                                    reporteEficacia[proveedor.nombre] =
                                        documentos.filter(documento =>
                                            documento.documentosGuia[0].guia.proveedor.id === proveedor.id
                                            && this.documentoService.getUltimoEstado(documento).id === estado.id
                                        ).length
                                }
                            )

                            console.log(this.dataSource);
                            this.dataSource.push(reporteEficacia);
                        }
                    )

                    console.log(this.dataSource);
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


    llenarTabla(proveedor, estado) {

        var porcentaje = 100;
        var total = this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length;
        var cantestadocourier = this.documentos.filter(documento =>
            documento.documentosGuia[0].guia.proveedor.id === proveedor.id
            && this.documentoService.getUltimoEstado(documento).id === estado.id
        ).length;
        var numero = (cantestadocourier * porcentaje) / total
        var final = numero.toFixed(1);
        return final + '%';
    }



    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }



    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };
    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };


    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '80%';
        }

        return 850;

    }


    xAxisCourier: any = {
        dataField: 'estado',
        showGridLines: false
    };

    seriesGroupsCourier: any[] =
        [
            {
                type: 'column',
                columnsGapPercent: 50,
                showLabels: true,
                seriesGapPercent: 0,
                valueAxis:
                {
                    visible: true,
                    displayValueAxis: true,
                    axisSize: 'auto',
                    minValue: 0,
                    maxValue: 'auto',
                    tickMarksColor: '#134f8e'
                },
                series:
                    [
                        {
                            dataField: 'URBANO',
                            displayText: 'URBANO'
                        },
                        {
                            dataField: 'DOCFLOW',
                            displayText: 'DOCFLOW'
                        }
                    ]
            }
        ];



}