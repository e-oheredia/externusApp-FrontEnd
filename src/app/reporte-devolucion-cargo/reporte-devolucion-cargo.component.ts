import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { ProveedorService } from '../shared/proveedor.service';

@Component({
  selector: 'app-reporte-devolucion-cargo',
  templateUrl: './reporte-devolucion-cargo.component.html',
  styleUrls: ['./reporte-devolucion-cargo.component.css']
})
export class ReporteDevolucionCargoComponent implements OnInit {

    
  constructor(public proveedorService: ProveedorService, 
    private utilsService: UtilsService, 
    private notifier: NotifierService) { 

    }

  proveedores = [];
  
  proveedoresSubscription: Subscription;
  documentoForm: FormGroup;

  ngOnInit() {
    this.documentoForm = new FormGroup({
        "fechaIni": new FormControl(moment().format('YYYY-MM-DD') , Validators.required),
        "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required)
      })
  
      this.listarProveedores();
  }

  
  
listarProveedores(){

    this.proveedoresSubscription = this.proveedorService.listarAll()
    .subscribe(
        proveedor =>{
            this.proveedores = []
            this.proveedores.push(proveedor);
            this.documentoForm.controls['fechaIni'].reset();
            this.documentoForm.controls['fechaFin'].reset();
            this.documentoForm.controls['fechaIni'].enable();
            this.documentoForm.controls['fechaFin'].enable();
            this.notifier.notify('success','LISTA DE PROVEEDORES ENCONTRADOS');
        },
        error =>{
            if(error.status ===400){
                this.proveedores = [];
                this.notifier.notify('error','NO HAY RESULTADOS');
            }
        }
    )
}

ngOnDestroy() {
    this.proveedoresSubscription.unsubscribe();
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

getWidth() : any {
    if (document.body.offsetWidth < 850) {
        return '90%';
    }
    
    return 850;
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
        columnsGapPercent: 70,
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
padding3: any = { left: 20, top: 5, right: 20, bottom: 5 };
titlePadding3: any = { left: 90, top: 0, right: 0, bottom: 10 };
xAxis3: any =
{
    dataField: 'Country',
    gridLines: { visible: true },
    flip: false
};
getWidth3() : any {
    if (document.body.offsetWidth < 850) {
        return '90%';
    }
    
    return 850;
}

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
