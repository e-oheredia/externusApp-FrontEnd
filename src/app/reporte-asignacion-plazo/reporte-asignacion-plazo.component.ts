import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from '../../../node_modules/angular-notifier';
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from '../../../node_modules/ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Subscription } from '../../../node_modules/rxjs';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import * as moment from "moment-timezone";
import { ButtonViewComponent } from '../shared/button-view.component';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { PlazoDistribucion } from '../../model/plazodistribucion.model';

@Component({
  selector: 'app-reporte-asignacion-plazo',
  templateUrl: './reporte-asignacion-plazo.component.html',
  styleUrls: ['./reporte-asignacion-plazo.component.css']
})
export class ReporteAsignacionPlazoComponent implements OnInit {

  constructor(    
    public plazoService : PlazoDistribucionService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService) {

   }
   dataPlazos: LocalDataSource = new LocalDataSource();
   settings = AppSettings.tableSettings;
   rutaManual: string = AppSettings.MANUAL_REGISTRO;
   data: any[] = [];
   plazos: PlazoDistribucion[] = [];

   plazoSubscription: Subscription;
   envioForm: FormGroup;


  ngOnInit() {
    this.envioForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    })
    this.tituloService.setTitulo("REPORTE DE AUTORIZACIONES");
    this.settings.hideSubHeader = false;
    this.generarColumnas();
    this.listarAutorizaciones();
  }

  generarColumnas() {
    this.settings.columns = {
      tipo: {
        title: 'Tipo de Asignación'
      },
      barea: {
        title: 'Buzón/Área'
      },
      plazoactual: {
        title: 'Plazo actual'
      },
      fecha: {
        title: 'Fecha de cambio'
      },
      autorizacion: {
        title: 'Autorización'
      },
      cantidad: {
        title: 'Cantidad de documentos'
      },
      buttonDescargarPermiso: {
        title: 'Autorización',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.mostrarData.subscribe(row => {
            let plazos = this.plazos.find(envio => envio.id == row.id)
            instance.ruta = plazos.rutaAutorizacion
          });

        }
      },

    }
  }
  listarAutorizaciones() {
    this.plazos = [];
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.envioForm.controls['fechaFin'].value)) {
      this.plazoSubscription = this.plazoService.listarPlazosAutorizados(this.envioForm.controls['fechaIni'].value, this.envioForm.controls['fechaFin'].value).subscribe(
        (data: any) => {
          this.dataPlazos.reset();
          this.data = data;
          let dataPlazos = [];
          if (!this.utilsService.isUndefinedOrNullOrEmpty(data)){          




          }
          this.dataPlazos.load(data);
          // console.log("data")
          // console.log(data)
      },

        /*         plazos => {          
          this.dataPlazos.reset();
          let dataPlazos = [];
          if (!this.utilsService.isUndefinedOrNullOrEmpty(plazos)){
            this.plazos = plazos
            plazos.forEach(
              plazos => {
                dataPlazos.push({
                  id: plazos.id,
                  tipo: plazos.buzon.area.nombre,
                  barea: envio.buzon.nombre,
                  plazoactual: envio.producto.nombre,
                  fecha: envio.plazoDistribucion.nombre,
                  cantidad: this.envioService.getUltimaFechaEstadoAutorizacion(envio)
                })
              }
            )
          }
          this.dataPlazos.load(dataPlazos);
        }, */
        error => {
          if (error.status === 400) {
            this.plazos = [];
            this.notifier.notify('error', 'El rango de fechas es incorrecto');
          }
        }
      )
    }
    else {
      this.notifier.notify('error', 'Debe ingresar un rango de fechas');
    }
  }

  exportar() {
    this.plazoService.exportarAutorizaciones(this.data)
  }
}
