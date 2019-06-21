import { Component, OnInit } from '@angular/core';
import { GuiaService } from '../shared/guia.service';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { TituloService } from '../shared/titulo.service';
import * as moment from "moment-timezone";
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Guia } from 'src/model/guia.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoConsultaGuia } from '../enum/tipoconsultaguia.enum';
import { TipoGuiaEnum } from '../enum/tipoguia.enum';

@Component({
  selector: 'app-reporte-guias-bloque',
  templateUrl: './reporte-guias-bloque.component.html',
  styleUrls: ['./reporte-guias-bloque.component.css']
})
export class ReporteGuiasBloqueComponent implements OnInit {

  constructor(
    private guiaService: GuiaService,
    private utilsService: UtilsService,
    private notifierService: NotifierService,
    private tituloService: TituloService
  ) { }

  dataGuias: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;

  guias: Guia[] = [];
  guia: Guia;

  guiaSubscription: Subscription;
  guiaForm: FormGroup;
  verificador: number = TipoConsultaGuia.GUIA_NORMAL

  ngOnInit() {
    this.guiaForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "codigo": new FormControl('', Validators.required),
      'guiaActiva': new FormControl('', Validators.required),
    })
    this.tituloService.setTitulo("HISTORIAL DE GUIAS - BLOQUE");
    this.settings.hideSubHeader = false;
    this.generarColumnas();
    this.listarGuias();
    console.log("GUIA BLOQUE");
    console.log(this.guias);
  }



  generarColumnas() {
    this.settings.columns = {
      numero: {
        title: 'Número de guía'
      },
      proveedor: {
        title: 'Proveedor'
      },
      plazo: {
        title: 'Plazo distribución'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      tipoSeguridad: {
        title: 'Tipo de seguridad'
      },
      sede: {
        title: 'Sede'
      },
      pendienteResultado: {
        title: 'Pendiente de resultado'
      },
      totalDocumentos: {
        title: 'Total de documentos'
      },
     fechaCreacion: {
        title: 'Fecha Creación'
      },
      fechalimite: {
        title: 'Fecha Límite'
      },
      fechaEnvio: {
        title: 'Fecha envío'
      },
      fechaUltimoEstado: {
        title: 'Fecha último estado'
      },
      estado: {
        title: 'Estado'
      }
    }
  }



  listarGuias() {
    if (this.guiaForm.controls['codigo'].value.length !== 0) {
      if (this.guiaForm.get("guiaActiva").value =='1'){
        this.verificador=TipoConsultaGuia.GUIA_ACTIVA;
      }
      this.guiaSubscription = this.guiaService.listarGuiaPorCodigo(this.guiaForm.controls['codigo'].value,this.verificador, TipoGuiaEnum.GUIA_BLOQUE)
        .subscribe(
          guia => {
            this.guias = []
            this.guias.push(guia)
            let dataGuias = [];
            dataGuias.push({
              numero: guia.numeroGuia,
              proveedor: guia.proveedor.nombre,
              plazo: guia.plazoDistribucion.nombre,
              tipoServicio: guia.tipoServicio.nombre,
              tipoSeguridad: guia.tipoSeguridad.nombre,
              sede: guia.sede.nombre,
              pendienteResultado: guia.cantidadDocumentosPendientes,
              totalDocumentos: guia.cantidadDocumentos,
              fechaCreacion:this.guiaService.getFechaCreacion(guia),
              fechalimite: guia.fechaLimite ? guia.fechaLimite : '-',
              fechaEnvio: !this.utilsService.isUndefinedOrNullOrEmpty(this.guiaService.getFechaEnvio(guia)) ? this.guiaService.getFechaEnvio(guia) : ' ',
              fechaUltimoEstado: this.guiaService.getFechaUltimoEstadoGuia(guia),
              estado: this.guiaService.getEstadoGuia(guia).nombre
            })
            this.guias.push(guia);
            this.dataGuias.load(dataGuias);
            this.guiaForm.controls['codigo'].setValue('');
            this.guiaForm.controls['fechaIni'].reset();
            this.guiaForm.controls['fechaFin'].reset();
            this.guiaForm.controls['fechaIni'].enable();
            this.guiaForm.controls['fechaFin'].enable();
            this.notifierService.notify('success', 'Guía encontrada');
          },
          error => {
            if (error.status === 400) {
              this.guias = [];
              this.notifierService.notify('error', 'No hay resultados');
            }
          }
        );
        this.verificador=TipoConsultaGuia.GUIA_NORMAL;
    }

    else if (!this.utilsService.isUndefinedOrNullOrEmpty(this.guiaForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.guiaForm.controls['fechaFin'].value)) {
      if (this.guiaForm.get("guiaActiva").value =='1'){
        this.verificador=TipoConsultaGuia.GUIA_ACTIVA;
      }
      this.guiaSubscription = this.guiaService.listarGuiasPorFechas(this.guiaForm.controls['fechaIni'].value, this.guiaForm.controls['fechaFin'].value,this.verificador, TipoGuiaEnum.GUIA_BLOQUE)
        .subscribe(
          guias => {
            this.guias = guias
            this.guiaForm.controls['codigo'].enable();

            this.dataGuias.reset();
            this.guiaService.listarGuiasPorFechas(this.guiaForm.controls['fechaIni'].value, this.guiaForm.controls['fechaFin'].value,this.verificador, TipoGuiaEnum.GUIA_BLOQUE).subscribe(
              guias => {
                console.log("GUIA BLOQUE");
                console.log(this.guias);
                this.guias = guias;
                let dataGuias = [];
                guias.forEach(
                  guia => {
                    dataGuias.push({
                      numero: guia.numeroGuia,
                      proveedor: guia.proveedor.nombre,
                      plazo: guia.plazoDistribucion.nombre,
                      tipoServicio: guia.tipoServicio.nombre,
                      tipoSeguridad: guia.tipoSeguridad.nombre,
                      sede: guia.sede.nombre,
                      pendienteResultado:guia.cantidadDocumentosPendientes,
                      totalDocumentos: guia.cantidadDocumentos,
                      fechaCreacion: this.guiaService.getFechaCreacion(guia),
                      fechalimite: guia.fechaLimite,
                      fechaEnvio: !this.utilsService.isUndefinedOrNullOrEmpty(this.guiaService.getFechaEnvio(guia)) ? this.guiaService.getFechaEnvio(guia) : ' ',
                      fechaUltimoEstado: this.guiaService.getFechaUltimoEstadoGuia(guia),
                      estado: this.guiaService.getEstadoGuia(guia).nombre
                    })
                  }                  
                )
                this.verificador=TipoConsultaGuia.GUIA_NORMAL;
                this.dataGuias.load(dataGuias);
              }
            )
          },
          error => {
            if (error.status === 400) {
              this.guias = [];
              this.notifierService.notify('error', 'El rango de fechas es incorrecto');
            }
          }
        );
    }

    else {
      this.notifierService.notify('error', 'Debe ingresar el código o un rango de fechas');
    }
  }



  desactivarFechas(codigo) {
    if (codigo.length === 0) {
      this.guiaForm.controls['fechaIni'].enable();
      this.guiaForm.controls['fechaFin'].enable();
    } else {
      this.guiaForm.controls['fechaIni'].disable();
      this.guiaForm.controls['fechaFin'].disable();
    }
  }

  desactivarCodigo(fechaIni, fechaFin) {
    if (this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) && this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {
      this.guiaForm.controls['codigo'].enable();
    } else {
      this.guiaForm.controls['codigo'].disable();
    }
  }


  // exportar(){
  //   this.guiaService.exportarGuias(this.guias)
  // }



}
