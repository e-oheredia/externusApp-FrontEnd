import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-indicador-volumen',
  templateUrl: './reporte-indicador-volumen.component.html',
  styleUrls: ['./reporte-indicador-volumen.component.css']
})
export class ReporteIndicadorVolumenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }




  sampleData: any[] = [
    { Mes: 'Enero', Cantidad: 2569 },
    { Mes: 'Febrero', Cantidad: 1857 },
    { Mes: 'Marzo', Cantidad: 2247 },
    { Mes: 'Abril', Cantidad: 2486 },
    { Mes: 'Mayo', Cantidad: 2236 },
    { Mes: 'Junio', Cantidad: 1851 },
    { Mes: 'Julio', Cantidad: 2395 },
    { Mes: 'Agosto', Cantidad: 1720 },
    { Mes: 'Septiembre', Cantidad: 980 },
    { Mes: 'Octubre', Cantidad: 1230 },
    { Mes: 'Noviembre', Cantidad: 2050 },
    { Mes: 'Diciembre', Cantidad: 1700 }
];
padding: any = { left: 10, top: 10, right: 15, bottom: 10 };
titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };
getWidth() : any {
if (document.body.offsetWidth < 850) {
  return '90%';
}

return 850;
}

xAxis: any =
{
    dataField: 'Mes',
    unitInterval: 1,
    tickMarks: { visible: true, interval: 1 },
    gridLinesInterval: { visible: true, interval: 1 },
    valuesOnTicks: false,
    padding: { bottom: 10 }
};
valueAxis: any =
{
    unitInterval: 500,
    minValue: 0,
    maxValue: 5000,
    title: { text: 'Time in minutes<br><br>' },
    labels: { horizontalAlignment: 'right' }
};
seriesGroups: any[] =
[
    {
        type: 'line',
        series:
        [
            {
                dataField: 'Cantidad',
                symbolType: 'square',
                labels:
                {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: { left: 5, right: 5, top: 0, bottom: 0 }
                }
            }
        ]
    }
];







}
