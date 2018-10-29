import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { DocumentoService } from '../shared/documento.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';

@Component({
  selector: 'app-reporte-devolucion-cargo',
  templateUrl: './reporte-devolucion-cargo.component.html',
  styleUrls: ['./reporte-devolucion-cargo.component.css']
})
export class ReporteDevolucionCargoComponent implements OnInit {


    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    proveedores: Proveedor[];
    dataGraficoDevolucionCargos = [];
    dataGraficoDevolucionDocumentos = [];
    dataGraficoDetallePendienteArea = [];
    
  constructor(

    public notifier: NotifierService,
    public utilsService: UtilsService,
    public documentoService: DocumentoService,
    public proveedorService: ProveedorService
    
    ) { 

    }

  

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

  
  



  ngOnDestroy() {
    
  }


  MostrarReportes(fechaIni: Date, fechaFin: Date) {


    let fi = new Date(new Date(fechaIni).getTimezoneOffset()*60*1000 + new Date(fechaIni).getTime());
    let ff = new Date(new Date(fechaFin).getTimezoneOffset()*60*1000 + new Date(fechaFin).getTime()); 
    let fechaInicial = new Date(moment(new Date(fi.getFullYear(),fi.getMonth(),1),"DD-MM-YYYY HH:mm:ss"));
    let fechaFinal = new Date(moment(new Date(ff.getFullYear(),ff.getMonth(),1),"DD-MM-YYYY HH:mm:ss"));

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {
        
     
        this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin, EstadoDocumentoEnum.ENVIADO).subscribe( 


            documentos => {


                this.dataGraficoDevolucionCargos = [];
                this.dataGraficoDevolucionDocumentos = [];
                this.dataGraficoDetallePendienteArea = [];

                let registroDevolucionCargosGeneral = {
                    Courier : "",
                    Devuelto : 0,
                    Pendiente : 0
                }

                registroDevolucionCargosGeneral.Courier = "GENERAL";
                registroDevolucionCargosGeneral.Devuelto = documentos.filter(documento => {   
                    return documento.recepcionado === true &&
                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,4)) === false
                    }
                ).length;
                registroDevolucionCargosGeneral.Pendiente = documentos.filter(documento => {   
                    return documento.recepcionado === false &&
                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,4)) === false
                    }
                ).length;

                this.dataGraficoDevolucionCargos.push(registroDevolucionCargosGeneral);

                
                let registroDevolucionDocumentosGeneral = {
                    Courier : "",
                    Devuelto : 0,
                    Pendiente : 0                    
                }

                registroDevolucionDocumentosGeneral.Courier = "GENERAL";
                registroDevolucionDocumentosGeneral.Devuelto = documentos.filter(documento => {   
                    return documento.recepcionado === true &&
                    (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,5)) === false ||
                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,6)) === false)
                    }
                ).length;
                registroDevolucionDocumentosGeneral.Pendiente = documentos.filter(documento => {   
                    return documento.recepcionado === false &&
                    (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,5)) === false ||
                    this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,6)) === false)
                    }
                ).length;

                this.dataGraficoDevolucionDocumentos.push(registroDevolucionDocumentosGeneral);

                this.proveedores.forEach(


                    proveedor => {

                        let registroDevolucionCargosProveedor = {
                            Courier : "",
                            Devuelto : 0,
                            Pendiente : 0
                        }

                        registroDevolucionCargosProveedor.Courier = proveedor.nombre;
                        registroDevolucionCargosProveedor.Devuelto = documentos.filter(documento => {   
                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && 
                            documento.recepcionado === true &&
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,4)) === false
                            }
                        ).length;
                        registroDevolucionCargosProveedor.Pendiente = documentos.filter(documento => {   
                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && 
                            documento.recepcionado === false &&
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,4)) === false
                            }
                        ).length;


                        this.dataGraficoDevolucionCargos.push(registroDevolucionCargosProveedor);

                        let registroDevolucionDocumentoProveedor = {
                            Courier : "",
                            Devuelto : 0,
                            Pendiente : 0
                        }

                        registroDevolucionDocumentoProveedor.Courier = proveedor.nombre;
                        registroDevolucionDocumentoProveedor.Devuelto = documentos.filter(documento => {   
                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && 
                            documento.recepcionado === true &&
                            (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,5)) === false ||
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,6)) === false)
                            }
                        ).length;
                        registroDevolucionDocumentoProveedor.Pendiente = documentos.filter(documento => {   
                            return documento.documentosGuia[0].guia.proveedor.id === proveedor.id && 
                            documento.recepcionado === false &&
                            (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,5)) === false ||
                            this.utilsService.isUndefinedOrNullOrEmpty(this.documentoService.getSeguimientoDocumentoByEstadoId(documento,6)) === false)
                            }
                        ).length;

                        this.dataGraficoDevolucionDocumentos.push(registroDevolucionDocumentoProveedor);


                    }

                )








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


cargosDevueltos: any[] = [
    { Courier: 'GENERAL', Devuelto: 80, Pendiente: 20},
    { Courier: 'DOCFLOW', Devuelto: 27, Pendiente: 11 },
    { Courier: 'URBANO', Devuelto: 53, Pendiente: 9 }
];

documentosDevueltos: any[] = [
    { Courier: 'GENERAL', Devuelto: 80, Pendiente: 20},
    { Courier: 'DOCFLOW', Devuelto: 27, Pendiente: 11 },
    { Courier: 'URBANO', Devuelto: 53, Pendiente: 9 }
];


pendientesPorArea: any = [
    { Country: 'China', Population: 1347350000, Percent: 19.18 },
    { Country: 'India', Population: 1210193422, Percent: 17.22 },
    { Country: 'USA', Population: 313912000, Percent: 4.47 },
    { Country: 'Indonesia', Population: 237641326, Percent: 3.38 },
    { Country: 'Brazil', Population: 192376496, Percent: 2.74 }
];











//**************************************************************************************************************************************** */
getWidth() : any {
    if (document.body.offsetWidth < 850) {
        return '90%';
    }
    
    return '100%';
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
        columnsGapPercent: 80,
        seriesGapPercent: 0,
        valueAxis:
        {
            unitInterval: 10,
            minValue: 0,
            maxValue: 100,
            displayValueAxis: true,
            description: 'Cantidad de cargos',
            axisSize: 'auto',
            tickMarksColor: '#FFFFFF'
        },
        series: [
            { dataField: 'Devuelto', displayText: 'Devuelto' },
            { dataField: 'Pendiente', displayText: 'Pendiente' }
        ]
    }
];



//********************************************************************************************************************* */
//padding3: any = { left: 20, top: 5, right: 20, bottom: 5 };
//titlePadding3: any = { left: 90, top: 0, right: 0, bottom: 10 };


xAxis3: any =
{
    dataField: 'Country',
    gridLines: { visible: true },
    flip: false
};
/*getWidth3() : any {
    if (document.body.offsetWidth < 850) {
        return '90%';
    }
    
    return '100%';
}
*/
valueAxis3: any =
{
    flip: true,
    labels: {
        visible: true,
        formatFunction: (value: string) => {
            return parseInt(value) / 1000000;
        }
    }
};
seriesGroups3: any[] =
[
    {
        type: 'column',
        orientation: 'horizontal',
        columnsGapPercent: 50,
        toolTipFormatSettings: { thousandsSeparator: ',' },
        series: [
            { dataField: 'Population', displayText: 'Population (millions)' }
        ]
    }
];





}
