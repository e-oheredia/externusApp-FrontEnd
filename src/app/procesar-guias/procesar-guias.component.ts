import { Component, OnInit } from '@angular/core';
import { GuiaService } from '../shared/guia.service';
import { NotifierService } from 'angular-notifier';
import { Guia } from 'src/model/guia.model';
import { DocumentoService } from '../shared/documento.service';
import { EstadoDocumentoService } from '../shared/estadodocumento.service';
import { UtilsService } from '../shared/utils.service';
import { AppSettings } from '../shared/app.settings';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-procesar-guias',
  templateUrl: './procesar-guias.component.html',
  styleUrls: ['./procesar-guias.component.css']
})
export class ProcesarGuiasComponent implements OnInit {

  constructor(
    public guiaService: GuiaService,
    public documentoService: DocumentoService,
    private estadoDocumentoService: EstadoDocumentoService,
    private utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  dataGuiasPorProcesar: LocalDataSource = new LocalDataSource();
  rutaPlantillaResultados: string = AppSettings.PANTILLA_RESULTADOS;
  settings = AppSettings.tableSettings;
  guias: Guia[] = [];
  guia: Guia;

  guiasSubscription: Subscription;

  estadoDocumentoForm = EstadoDocumentoEnum;
  // excelFile: File;
  // excelForm: FormGroup;

  ngOnInit() {
    // this.listarGuiasEnviadas();
    // this.listarGuiasSinCerrar();
    this.generarColumnas();
    this.listarGuiasPorProcesar();
  }

  generarColumnas() {
    this.settings.columns = {
      fechaEnvio: {
        title: 'Fecha de envío'
      },
      nroGuia: {
        title: 'Número de guía'
      },
      sede: {
        title: 'Sede'
      },
      plazo: {
        title: 'Plazo de distribución'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      tipoSeguridad: {
        title: 'Fecha de envío'
      },
      fechalimite: {
        title: 'Fecha limite de resultado'
      },
      descargarBase: {
        title: '-'
      },
      entregados: {
        title: 'Entregados'
      },
      rezagados: {
        title: 'Rezagados'
      },
      devueltos: {
        title: 'Devueltos'
      },
      extraviados: {
        title: 'Extraviados'
      },
      pendientesResultado: {
        title: 'Pendientes de resultado'
      },
      total: {
        title: 'Total'
      },
      subirBase: {
        title: '-'
      },
    }
  }

  listarGuiasPorProcesar() {
    this.guiasSubscription = this.guiaService.listarGuiasEnviadas()
      .subscribe(
        guias => {
          this.guias = guias;
          let dataGuiasPorProcesar = [];

          guias.forEach(guia => {
            dataGuiasPorProcesar.push({
              // fechaEnvio: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia,2).fecha,
              // fechaEnvio: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(this.guia,2).fecha,
              // nroGuia: guia.numeroGuia,
              sede: guia.sede.nombre,
              plazo: guia.plazoDistribucion.nombre,
              tipoServicio: guia.tipoServicio.nombre,
              tipoSeguridad: guia.tipoSeguridad.nombre,
              fechalimite: "FALTA CÓDIGO",
              entregados: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.ENTREGADO).length,
              rezagados: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.REZAGADO).length,
              devueltos: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.DEVUELTO).length,
              extraviados: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.EXTRAVIADO).length,
              pendientesResultado: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.ENVIADO).length,
              total: "FALTA CÓDIGO"
            })
          })
          
          this.guias.push(this.guia);
          this.dataGuiasPorProcesar.load(dataGuiasPorProcesar);
        },
        error => {
          if (error.status === 400) {
            this.guias = [];
            this.notifier.notify('error', 'NO HAY RESULTADOS');
          }
        }
      )
  }




















































































  // listarGuiasEnviadas() {
  //   this.guiaService.listarGuiasEnviadas().subscribe(
  //     guiasEnviadas => {
  //       this.guiasEnviadas = guiasEnviadas;
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }

  exportar(guia: Guia) {
    this.guiaService.exportarDocumentosGuia(guia);
  }

  // listarGuiasSinCerrar() {
  //   this.excelForm = new FormGroup({
  //     'excelFile': new FormControl('', Validators.required)
  //   });
  //   this.guiaService.listarGuiasSinCerrar().subscribe(
  //     guiasSinCerrar => this.guiasSinCerrar = guiasSinCerrar
  //   )
  // }

  // onChangeExcelFile(file: File) {
  //   this.excelFile = file;
  // }

  // onSubmit(excelFile: File) {
  //   if (this.utilsService.isUndefinedOrNull(excelFile)) {
  //     this.notifier.notify("success", "Seleccione el archivo excel a subir");
  //     return;
  //   }
  //   this.subirResutados(excelFile);
  // }

  // subirResutados(file: File) {
  //   this.documentoService.mostrarResultadosDocumentosProveedor(file, 0, (data) => {
  //     if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
  //       this.documentoService.actualizarResultadosProveedor(data).subscribe(
  //         respuesta => {
  //           this.notifier.notify('success', respuesta.mensaje);
  //           this.excelForm.reset();
  //           this.listarGuiasSinCerrar();
  //         },
  //         error => {
  //           this.notifier.notify('error', error.error.mensaje);
  //         }
  //       )
  //       return;
  //     }
  //     this.notifier.notify('error', data.mensaje);
  //   })
  // }

}
