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
import { ReporteService } from '../shared/reporte.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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

    dataSource = [];
    estados: EstadoDocumento[] = [];
    proveedores: Proveedor[] = [];
    documentos = [];
    estadosParaReporte = []
    eficaciaReporte: any[] = [];
    documentosSubscription: Subscription;
    documentoForm: FormGroup;

    data: any[] = [];

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
        // this.estadoDocumentoService.estadosDocumentoChanged.subscribe(
        //     estados => {
        //         this.estados = estados;
        //     }
        // )

        console.log(this.estados)
    }


    MostrarReportes(fechaIni: Date, fechaFin: Date) {

        console.log(this.estados)

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) &&
            !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            this.documentosSubscription = this.reporteService.getReporteEficaciaEstadosPorProveedor(fechaIni, fechaFin).subscribe(
                (data: any) => {
                    this.data = data
                    this.llenarEficaciaEstadosPorProveedor(data);
                }
            )
        }
        else {
            this.notifier.notify('error', 'Seleccione rango de fechas');
        }
    }


    //1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO//1-GRAFICO
    llenarEficaciaEstadosPorProveedor(data) {
        this.eficaciaReporte = [];
        let valorproveedor = 0;
        let total1EstadoPorProveedores = 0;
        let totalproveedor = 0;
        let cantidadproveedorestado = 0;
        let total = 0;
        let valortotal = 0;

        this.estados.forEach(
            estado => {
                let eficienciaPorEstadoObjeto = {
                    estado: "",
                    proveedor: "",
                    cantidad: 0
                };
                eficienciaPorEstadoObjeto.estado = estado.nombre;
                Object.keys(data).forEach(key => {
                    var obj1 = data[key];
                    if (estado.id === parseInt(key)) {
                        Object.keys(obj1).forEach(key1 => {
                            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key1))
                            if (proveedor.id === parseInt(key1)) {
                                eficienciaPorEstadoObjeto.proveedor = proveedor.nombre
                                eficienciaPorEstadoObjeto.cantidad = obj1[key1]
                                cantidadproveedorestado = obj1[key1]
                            }
                            eficienciaPorEstadoObjeto.cantidad = cantidadproveedorestado
                            total1EstadoPorProveedores += cantidadproveedorestado
                        });
                        this.eficaciaReporte.push(total1EstadoPorProveedores);
                    }
                });
                valortotal = total1EstadoPorProveedores
                let porcentajePorEstado = (valorproveedor / valortotal) * 100;
                let positivo = porcentajePorEstado.toFixed(1);
                this.eficaciaReporte.push(eficienciaPorEstadoObjeto);
            });
        console.log(this.eficaciaReporte);
    }




    // llenarTabla(proveedor, estado) {

    //     var porcentaje = 100;
    //     var total = this.documentos.filter(documento => documento.documentosGuia[0].guia.proveedor.id === proveedor.id).length;
    //     if (total==0) {
    //         return '0.0%';
    //     }
    //     var cantestadocourier = this.documentos.filter(documento =>
    //         documento.documentosGuia[0].guia.proveedor.id === proveedor.id
    //         && this.documentoService.getUltimoEstado(documento).id === estado.id
    //     ).length;
    //     var numero = (cantestadocourier * porcentaje) / total
    //     var final = numero.toFixed(1);
    //     return final + '%';
    // }



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