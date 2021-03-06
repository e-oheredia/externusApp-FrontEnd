import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { EstadoDocumentoService } from '../shared/estadodocumento.service';
import { EstadoDocumento } from '../../model/estadodocumento.model';
import { ReporteService } from '../shared/reporte.service';
import { Area } from '../../model/area.model';

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
        public estadoDocumentoService: EstadoDocumentoService,
        public reporteService: ReporteService
    ) { }

    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    estados: EstadoDocumento[] = [];
    proveedores: Proveedor[] = [];
    area: Area[] = [];
    data: any[] = [];
    dataSource = [];
    validacion: number;
    seriesGroups: any[];

    ngOnInit() {
        this.validacion = 0;
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
        });
        this.proveedores = this.proveedorService.getProveedores();
        this.proveedorService.proveedoresChanged.subscribe(
            proveedores => {
                this.proveedores = proveedores;
            }
        )
        this.estados = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor();
        this.estados.push(
            {
                id: 3,
                nombre: 'PENDIENTE DE ENTREGA',
                estadosDocumentoPermitidos: [],
                motivos: [],
                tiposDevolucion: []
            },
            {
                id: 4,
                nombre: 'ENTREGADO',
                estadosDocumentoPermitidos: [],
                motivos: [],
                tiposDevolucion: []
            },
            {
                id: 5,
                nombre: 'REZAGADO',
                estadosDocumentoPermitidos: [],
                motivos: [],
                tiposDevolucion: []
            },
            {
                id: 6,
                nombre: 'NO DISTRIBUIBLE',
                estadosDocumentoPermitidos: [],
                motivos: [],
                tiposDevolucion: []
            }
        );
    }


    MostrarReportes(fechaIni: Date, fechaFin: Date) {
        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) &&
            !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            this.documentosSubscription = this.reporteService.getReporteEficaciaEstadosPorProveedor(fechaIni, fechaFin).subscribe(
                (data: any) => {
                    this.validacion = 1;
                    this.data = data;
                    this.llenarEficaciaEstadosPorProveedor(data);
                    this.getdatas2();
                },
                error => {
                    if (error.status === 409) {
                        this.validacion = 2
                    }
                    if (error.status === 417) {
                        this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
                    }
                    if (error.status === 424) {
                        this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
                    }
                }
            )
        }
        else {
            this.validacion = 0
        }
    }



    //1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO
    llenarEficaciaEstadosPorProveedor(data) {
        this.dataSource = [];
        let cantidad = 0;

        this.estados.forEach(
            estado => {
                let reporteEficacia = {
                    estado: estado.nombre
                };
                Object.keys(data).forEach(key => {
                    if (estado.id === parseInt(key)) {
                        let total = 0;
                        var obj1 = data[key];
                        for (var el in obj1) {
                            if (obj1.hasOwnProperty(el)) {
                                total += parseInt(obj1[el]);
                            }
                        }
                        Object.keys(obj1).forEach(key1 => {
                            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key1))
                            if (proveedor.id === parseInt(key1)) {
                                cantidad = obj1[key1]
                                let porcentaje = (cantidad / total) * 100;
                                if (isNaN(porcentaje)) {
                                    porcentaje = 0
                                }
                                let decimal = porcentaje.toFixed(1);
                                reporteEficacia[proveedor.nombre] = decimal + "%";
                            }
                        });
                        this.dataSource.push(reporteEficacia)
                    }
                });
            }
        );
    }

    estadoProveedor(proveedor, estado) {
        var cantidad = 0;
        Object.keys(this.data).forEach(key => {
            if (estado.id === parseInt(key)) {
                var provedor = this.data[key]
                Object.keys(provedor).forEach(key1 => {
                    if (proveedor.id === parseInt(key1)) {
                        cantidad = provedor[key1];
                    }
                });
            }
        });
        return cantidad;
    }

    generalPorEstado(estado) {
        var total = 0;
        Object.keys(this.data).forEach(key => {
            if (estado.id === parseInt(key)) {
                var prove = this.data[key];
                Object.keys(prove).forEach(key2 => {
                    let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key2))
                    if (proveedor.id === parseInt(key2)) {
                        total += prove[key2]
                    }
                })

            }
        });
        return total;
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

    xAxis: any = {
        dataField: 'estado',
        showGridLines: false
    };

    getdatas2() {
        let seriesGroupss: any[] = [];
        let series: any[] = [];

        this.proveedores.forEach(
            proveedor => {
                series.push(
                    {
                        dataField: proveedor.nombre,    //LO QUE SE PINTA EN EL GRAFICO
                        displayText: proveedor.nombre
                    })
            })

        seriesGroupss.push({
            type: 'column',
            columnsGapPercent: 50,
            showLabels: true,
            seriesGapPercent: 5,
            valueAxis:
            {
                visible: true,
                displayValueAxis: true,
                axisSize: 'auto',
                minValue: 0,
                maxValue: 'auto',
                tickMarksColor: '#134f8e'
            },
            series: series
        })
        this.seriesGroups = seriesGroupss;
    }


}