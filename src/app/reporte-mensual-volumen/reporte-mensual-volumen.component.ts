import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';

@Component({
  selector: 'app-reporte-mensual-volumen',
  templateUrl: './reporte-mensual-volumen.component.html',
  styleUrls: ['./reporte-mensual-volumen.component.css']
})
export class ReporteMensualVolumenComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService, 
    public notifier: NotifierService, 
    public utilsService: UtilsService) { 

    }

  
  documentos = [];
  documentosSubscription: Subscription;
  documentoForm: FormGroup;

  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni" : new FormControl(null, Validators.required),
      "fechaFin" : new FormControl(null, Validators.required)
    })
  }


  MostrarReportes(fechaIni: Date, fechaFin: Date){

    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.contains['fechaFin'].value)){

      this.documentosSubscription = this.documentoService.listarDocumentosReportesVolumen(fechaIni, fechaFin).subscribe(
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


  ngOnDestroy(){
    this.documentosSubscription.unsubscribe();
  }




/*      PRACTICANDO CON REPORTES    */


dataSource = [];

llenarDataSource() {
    this.dataSource = [];

    let documentoCreado = {
        Courier: "Creado",
        cantidad: this.documentos.filter(
            documento => this.documentoService.getUltimoEstado(documento).id === 1).length
    }

    let documentoCustodiado = {
        Courier: "Custodiado",
        cantidad: this.documentos.filter(
            documento => this.documentoService.getUltimoEstado(documento).id === 2).length
    }

    this.dataSource.push(documentoCreado);
    this.dataSource.push(documentoCustodiado);
}


padding: any = { left: 10, top: 5, right: 10, bottom: 5 };
titlePadding: any = { left: 50, top: 0, right: 0, bottom: 10 };


getWidth(): any {
    if (document.body.offsetWidth < 8550) {
        return '95%';
    }

    return 850;
}

xAxis: any =
    {
        dataField: 'Estado',
        unitInterval: 1,
        tickMarks: {
            visible: true,
            interval: 1,
            color: '#CACACA'
        },
        gridLines: {
            visible: false,
            interval: 1,
            color: '#CACACA'
        }
    };


valueAxis: any =
    {
        visible: true,
        title: { text: 'Cantidad por Estado' },
        tickMarks: { color: '#BCBCBC' }
    };

seriesGroups: any =
    [
        {
            type: 'line',
            valueAxis:
            {
                visible: true,
                unitInterval: 2,
                title: { text: 'Cantidadd' },
                minValue: 0
            },
            series: [
                { dataField: 'cantidad', displayText: 'Cantidad' }
            ]
        }
    ]

    seriesGroupss: any =
    [
        {
            type: 'column',
            valueAxis:
            {
                visible: true,
                unitInterval: 2,
                title: { text: 'Cantidadd' },
                minValue: 0
            },
            series: [
                { dataField: 'cantidad', displayText: 'Cantidad' }
            ]
        }
    ]

















}
