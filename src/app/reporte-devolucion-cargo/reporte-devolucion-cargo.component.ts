import { Component, OnInit } from '@angular/core';
import { Subscription, zip } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { DocumentoService } from '../shared/documento.service';
import { AreaService } from '../shared/area.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { Area } from 'src/model/area.model';


@Component({
    selector: 'app-reporte-devolucion-cargo',
    templateUrl: './reporte-devolucion-cargo.component.html',
    styleUrls: ['./reporte-devolucion-cargo.component.css']
})
export class ReporteDevolucionCargoComponent implements OnInit {


    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    proveedores: Proveedor[];
    areasSubscription: Subscription;
    areas: Area[];
    dataGraficoDevolucionCargos = [];
    dataGraficoDevolucionDocumentos = [];
    dataGraficoDetallePendienteArea = [];
    dataGraficoDetallePendienteAreaTop = [];
    dataTablaCargo = [];
    dataTablaDocumento = [];

    dataTablaCargoArray = [];
    dataTablaDocumentoArray = [];

    tablaProveedores = [];

    pendientesDocu = [];

    constructor(
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public documentoService: DocumentoService,
        public proveedorService: ProveedorService,
        public areaService: AreaService
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

        this.areasSubscription = this.areaService.listarAreasAll().subscribe(
            areas => {
                this.areas = areas;
            }
        )

    }


    ngOnDestroy() {
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

        console.log(this.areas);
        let fi = new Date(new Date(fechaIni).getTimezoneOffset() * 60 * 1000 + new Date(fechaIni).getTime());
        let ff = new Date(new Date(fechaFin).getTimezoneOffset() * 60 * 1000 + new Date(fechaFin).getTime());
        let fechaInicial = new Date(moment(new Date(fi.getFullYear(), fi.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));
        let fechaFinal = new Date(moment(new Date(ff.getFullYear(), ff.getMonth(), 1), "DD-MM-YYYY HH:mm:ss"));

        let aIni = fechaInicial.getFullYear();
        let mIni = fechaInicial.getMonth();
        let aFin = fechaFinal.getFullYear();
        let mFin = fechaFinal.getMonth();

        
        if ((aFin - aIni) * 12 + (mFin - mIni) >= 13) {
            this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
            return;
        }

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {


            let fechaIniDate = new Date(fechaIni);
            let fechaFinDate = new Date(fechaFin);
            fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
            fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());


            this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD'), EstadoDocumentoEnum.ENVIADO).subscribe(
                documentos => {

                    let rTablaPendienteCar = {
                        estado: '',
                        general: '',
                        pro01: '',
                        pro02: '',
                        pro03: '',
                        pro04: '',
                        pro05: ''
                    }
                    let rTablaDevueltoCar = {
                        estado: '',
                        general: '',
                        pro01: '',
                        pro02: '',
                        pro03: '',
                        pro04: '',
                        pro05: ''
                    }

                    let rTablaPendienteDoc = {
                        estado: '',
                        general: '',
                        pro01: '',
                        pro02: '',
                        pro03: '',
                        pro04: '',
                        pro05: ''
                    }

                    let rTablaDevueltoDoc = {
                        estado: '',
                        general: '',
                        pro01: '',
                        pro02: '',
                        pro03: '',
                        pro04: '',
                        pro05: ''
                    }


                    this.dataGraficoDevolucionCargos = [];
                    this.dataGraficoDevolucionDocumentos = [];
                    this.dataGraficoDetallePendienteArea = [];
                    this.dataTablaCargo = [];
                    this.dataTablaDocumento = [];

                    this.dataTablaCargoArray = [];
                    this.dataTablaDocumentoArray = [];

                    this.tablaProveedores = [];

                    let cargosGeneral = {
                        Courier: "",
                        Devuelto: 0,
                        Pendiente: 0
                    }

                    cargosGeneral.Courier = "GENERAL";
                    cargosGeneral.Devuelto = documentos.filter(documento => {
                        return documento.recepcionado === true &&
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                    }
                    ).length;
                    cargosGeneral.Pendiente = documentos.filter(documento => {
                        return documento.recepcionado === false &&
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                    }
                    ).length;

                    this.dataGraficoDevolucionCargos.push(cargosGeneral);

                    //------------------------------------------- Registro Tabla Cargo ----------- -------------------------------------------------

                    rTablaPendienteCar.estado = 'PENDIENTE';
                    rTablaPendienteCar.general = this.Porcentaje(cargosGeneral.Pendiente, cargosGeneral.Pendiente + cargosGeneral.Devuelto);

                    rTablaDevueltoCar.estado = 'DEVUELTO';
                    rTablaDevueltoCar.general = this.Porcentaje(cargosGeneral.Devuelto, cargosGeneral.Pendiente + cargosGeneral.Devuelto);

                    this.dataTablaCargo.push(rTablaPendienteCar);
                    this.dataTablaCargo.push(rTablaDevueltoCar);


                    //--------------------------------------------------------------------------------------------------------------------------------



                    let documentosGeneral = {
                        Courier: "",
                        Devuelto: 0,
                        Pendiente: 0
                    }

                    documentosGeneral.Courier = "GENERAL";
                    // documentosGeneral.Devuelto = documentos.filter(documento => {
                    //     return documento.recepcionado === true &&
                    //         (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                    //             this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.DEVUELTO)) === false)
                    // }).length;
                    documentosGeneral.Devuelto = documentos.filter(documento => {
                        return documento.recepcionado === true &&
                            (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false )
                    }).length;

                    // documentosGeneral.Pendiente = documentos.filter(documento => {
                    //     return documento.recepcionado === false &&
                    //         (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                    //             this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.DEVUELTO)) === false)
                    // }).length;
                    documentosGeneral.Pendiente = documentos.filter(documento => {
                        return documento.recepcionado === false &&
                            (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false )
                    }).length;
                    

                    this.dataGraficoDevolucionDocumentos.push(documentosGeneral);


                    //------------------------------------------- Registro Tabla Documentos ----------------------------------------------------------

                    rTablaPendienteDoc.estado = 'PENDIENTE';
                    rTablaPendienteDoc.general = this.Porcentaje(documentosGeneral.Pendiente, documentosGeneral.Pendiente + documentosGeneral.Devuelto);

                    rTablaDevueltoDoc.estado = 'DEVUELTO';
                    rTablaDevueltoDoc.general = this.Porcentaje(documentosGeneral.Devuelto, documentosGeneral.Pendiente + documentosGeneral.Devuelto);


                    this.dataTablaDocumento.push(rTablaPendienteDoc);
                    this.dataTablaDocumento.push(rTablaDevueltoDoc);


                    //--------------------------------------------------------------------------------------------------------------------------------

                    // ----------------------------------------------- Datos Grafico x Area ----------------------------------------------------------

                    this.areas.forEach(

                        area => {

                            let r_area = {
                                nombre: '',
                                cantidad: '',
                            }

                            r_area.nombre = area.nombre;
                            let c = documentos.filter(documento => {

                                return documento.envio.buzon.area.id === area.id &&
                                    documento.recepcionado === false &&
                                    (
                                    // this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                                    // this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.DEVUELTO)) === false ||
                                    // this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                                    )
                            }
                            ).length;

                            r_area.cantidad = c.toString();

                            this.dataGraficoDetallePendienteArea.push(r_area);
                        }
                    )


                    this.dataGraficoDetallePendienteArea.sort((a, b) => (a.cantidad > b.cantidad) ? 1 : ((b.cantidad > a.cantidad) ? -1 : 0)).reverse();

                    let i = 1;
                    let BreakException = {};

                    let cantidad_otras_areas: number = 0;

                    let otras_areas = {
                        nombre: '',
                        cantidad: '',
                    }

                    this.dataGraficoDetallePendienteArea.forEach(
                        registro => {
                            if (i <= 6) {
                                this.dataGraficoDetallePendienteAreaTop.push(registro);
                                i++;
                            }
                            else {
                                cantidad_otras_areas += parseInt(registro.cantidad);
                            }
                        }
                    )

                    otras_areas.nombre = "OTROS";
                    otras_areas.cantidad = cantidad_otras_areas.toString();

                    this.dataGraficoDetallePendienteAreaTop.push(otras_areas);
                    console.log(this.dataGraficoDetallePendienteAreaTop);

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------         
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------




                    let jj: number = 1;

                    this.proveedores.forEach(


                        proveedor => {

                            let cargosProveedor = {
                                Courier: "",
                                Devuelto: 0,
                                Pendiente: 0
                            }

                            cargosProveedor.Courier = proveedor.nombre;
                            cargosProveedor.Devuelto = documentos.filter(documento => {
                                return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                    documento.recepcionado === true &&
                                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                            }
                            ).length;
                            cargosProveedor.Pendiente = documentos.filter(documento => {
                                return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                    documento.recepcionado === false &&
                                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.ENTREGADO)) === false
                            }
                            ).length;


                            this.dataGraficoDevolucionCargos.push(cargosProveedor);

                            //-------------------------------------------------- Actualizar columnas tabla Cargo  ---------------------------------------------------

                            let cargosP = this.Porcentaje(cargosProveedor.Pendiente, cargosProveedor.Pendiente + cargosProveedor.Devuelto);
                            let cargosD = this.Porcentaje(cargosProveedor.Devuelto, cargosProveedor.Pendiente + cargosProveedor.Devuelto);

                            if (jj === 1) {
                                this.dataTablaCargo.find(x => x.estado == 'PENDIENTE').pro01 = cargosP;
                                this.dataTablaCargo.find(x => x.estado == 'DEVUELTO').pro01 = cargosD;
                            }
                            if (jj === 2) {
                                this.dataTablaCargo.find(x => x.estado == 'PENDIENTE').pro02 = cargosP;
                                this.dataTablaCargo.find(x => x.estado == 'DEVUELTO').pro02 = cargosD;
                            }
                            if (jj === 3) {
                                this.dataTablaCargo.find(x => x.estado == 'PENDIENTE').pro03 = cargosP;
                                this.dataTablaCargo.find(x => x.estado == 'DEVUELTO').pro03 = cargosD;
                            }
                            if (jj === 4) {
                                this.dataTablaCargo.find(x => x.estado == 'PENDIENTE').pro04 = cargosP;
                                this.dataTablaCargo.find(x => x.estado == 'DEVUELTO').pro04 = cargosD;
                            }
                            if (jj === 5) {
                                this.dataTablaCargo.find(x => x.estado == 'PENDIENTE').pro05 = cargosP;
                                this.dataTablaCargo.find(x => x.estado == 'DEVUELTO').pro05 = cargosD;
                            }

                            //------------------------------------------------------------------------------------------------------------------------------------


                            let documentoProveedor = {
                                Courier: "",
                                Devuelto: 0,
                                Pendiente: 0
                            }

                            documentoProveedor.Courier = proveedor.nombre;
                            // documentoProveedor.Devuelto = documentos.filter(documento => {
                            //     return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                            //         documento.recepcionado === true &&
                            //         (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                            //             this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.DEVUELTO)) === false)
                            // }).length;
                            documentoProveedor.Devuelto = documentos.filter(documento => {
                                return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                    documento.recepcionado === true &&
                                    (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false)
                            }).length;

                            // documentoProveedor.Pendiente = documentos.filter(documento => {
                            //     return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                            //         documento.recepcionado === false &&
                            //         (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false ||
                            //             this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.DEVUELTO)) === false)
                            // }).length;
                            documentoProveedor.Pendiente = documentos.filter(documento => {
                                return documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                    documento.recepcionado === false &&
                                    (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento, EstadoDocumentoEnum.REZAGADO)) === false)
                            }).length;

                            this.dataGraficoDevolucionDocumentos.push(documentoProveedor);

                            //-------------------------------------------------- Actualizar columnas tabla Documento  ---------------------------------------------------

                            let cantidadDP = this.Porcentaje(documentoProveedor.Pendiente, documentoProveedor.Pendiente + documentoProveedor.Devuelto);
                            let cantidadDD = this.Porcentaje(documentoProveedor.Devuelto, documentoProveedor.Pendiente + documentoProveedor.Devuelto);

                            if (jj === 1) {
                                this.dataTablaDocumento.find(x => x.estado == 'PENDIENTE').pro01 = cantidadDP;
                                this.dataTablaDocumento.find(x => x.estado === 'DEVUELTO').pro01 = cantidadDD;
                            }
                            if (jj === 2) {
                                this.dataTablaDocumento.find(x => x.estado == 'PENDIENTE').pro02 = cantidadDP;
                                this.dataTablaDocumento.find(x => x.estado == 'DEVUELTO').pro02 = cantidadDD;
                            }
                            if (jj === 3) {
                                this.dataTablaDocumento.find(x => x.estado == 'PENDIENTE').pro03 = cantidadDP;
                                this.dataTablaDocumento.find(x => x.estado == 'DEVUELTO').pro03 = cantidadDD;
                            }
                            if (jj === 4) {
                                this.dataTablaDocumento.find(x => x.estado == 'PENDIENTE').pro04 = cantidadDP;
                                this.dataTablaDocumento.find(x => x.estado == 'DEVUELTO').pro04 = cantidadDD;
                            }
                            if (jj === 5) {
                                this.dataTablaDocumento.find(x => x.estado == 'PENDIENTE').pro05 = cantidadDP;
                                this.dataTablaDocumento.find(x => x.estado == 'DEVUELTO').pro05 = cantidadDD;
                            }

                            //----------------------------------------------------------------------------------------------------------------------------------------------


                            let listaProveedor = {
                                id: 0,
                                nombre: ""
                            }

                            if (jj === 1) {
                                listaProveedor.id = jj;
                                listaProveedor.nombre = 'GENERAL';
                            }
                            listaProveedor.id = jj + 1;
                            listaProveedor.nombre = proveedor.nombre;
                            this.tablaProveedores.push(listaProveedor);

                            jj++;

                        }



                    )


                    this.dataTablaCargoArray = this.dataTablaCargo.map(function (obj) {
                        return [obj.estado, obj.general, obj.pro01, obj.pro02, obj.pro03, obj.pro04, obj.pro05];
                    });

                    this.dataTablaDocumentoArray = this.dataTablaDocumento.map(function (obj) {
                        return [obj.estado, obj.general, obj.pro01, obj.pro02, obj.pro03, obj.pro04, obj.pro05];
                    });


                },
                error => {
                    if (error.status === 400) {
                        this.notifier.notify('error', 'Rango de fechas no válido');
                    }
                }



            );

        }
        else {
            this.notifier.notify('error', 'Seleccione un rango de fechas');
        }
    }




    //**************************************************************************************************************************************** */
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }

        return '80%';
    }

    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };




    xAxis: any =
        {
            dataField: 'Courier',
            showGridLines: true
        };
    seriesGroups: any[] =
        [
            {
                type: 'stackedcolumn',
                columnsGapPercent: 85,
                seriesGapPercent: 0,
                valueAxis:
                {
                    maxValue: 'auto',
                    minValue: 0,
                    displayValueAxis: true,
                    description: 'Cantidad de cargos',
                    axisSize: 'auto',
                    tickMarksColor: '#FFFFFF'
                },
                series: [
                    { dataField: 'Devuelto', displayText: 'Devuelto', showLabels: true, },
                    { dataField: 'Pendiente', displayText: 'Pendiente', showLabels: true, }
                ]
            }
        ];



    //********************************************************************************************************************* */


    xAxis3: any =
        {
            dataField: 'nombre',
            labels:
            {
                angle: 90,
                horizontalAlignment: 'right',
                verticalAlignment: 'center',
                rotationPoint: 'right',
                offset: { x: 0, y: -5 }
            }
        };

    valueAxis3: any =
        {
            minValue: 0,
            flip: true,
            labels: {
                visible: true
            }
        };
    seriesGroups3: any[] =
        [
            {
                type: 'column',
                orientation: 'horizontal',
                columnsMaxWidth: 30,
                toolTipFormatSettings: { thousandsSeparator: ',' },
                series: [
                    { dataField: 'cantidad', displayText: 'cantidad', showLabels: true, }
                ]
            }
        ];





}
