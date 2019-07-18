import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GuiaService } from '../shared/guia.service';
import { NotifierService } from 'angular-notifier';
import { Guia } from 'src/model/guia.model';
import { DocumentoService } from '../shared/documento.service';
import { AppSettings } from '../shared/app.settings';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Documento } from 'src/model/documento.model';
import { UtilsService } from '../shared/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { InconsistenciaResultado } from 'src/model/inconsistenciaresultado.model';
import { utils } from 'xlsx/types';

@Component({
  selector: 'app-procesar-guias',
  templateUrl: './procesar-guias.component.html',
  styleUrls: ['./procesar-guias.component.css']
})
export class ProcesarGuiasComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public guiaService: GuiaService,
    public documentoService: DocumentoService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
  ) { }

  @Output() confirmarEvent = new EventEmitter<File>();

  dataGuiasPorProcesar: LocalDataSource = new LocalDataSource();
  rutaPlantillaResultados: string = AppSettings.PLANTILLA_RESULTADOS;
  settings = AppSettings.tableSettings;

  procesarForm: FormGroup;
  excelFile: File;
  resultadosCorrectos: Documento[] = [];
  resultadosIncorrectos: InconsistenciaResultado[] = [];

  guias: Guia[] = [];
  documentos: Documento[] = [];

  guiasSubscription: Subscription;
  estadoDocumentoForm = EstadoDocumentoEnum;

  ngOnInit() {
    this.generarColumnas();
    this.listarGuiasPorProcesar();
    this.procesarForm = new FormGroup({
      'cantidadDocumentos': new FormControl(""),
      'cantidadCorrectos': new FormControl(""),
      'cantidadIncorrectos': new FormControl(""),
      'excel': new FormControl(null, Validators.required),
      'excel2': new FormControl(null),
    })
    this.settings.hideSubHeader = false;
    console.log(this.guias)
  }

  generarColumnas() {
    this.settings.columns = {
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
        title: 'Tipo de seguridad'
      },
      fechaEnvio: {
        title: 'Fecha de envío'
      },
      fechalimite: {
        title: 'Fecha limite de resultado'
      },
      descargarBase: {
        title: 'Descargar Base',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            this.descargarGuia(row);
          });
        }
      },
      fechadescarga: {
        title: 'Fecha de descarga'
      },
      total: {
        title: 'Total documentos'
      },
      entregados: {
        title: 'Entregados'
      },
      rezagados: {
        title: 'Rezagados'
      },
      nodistribuibles: {
        title: 'No Distribuibles'
      },
      pendientesResultado: {
        title: 'Pendientes de resultado'
      }
    }
  }

  listarGuiasPorProcesar() {
    this.guiasSubscription = this.guiaService.listarGuiasPorProcesar().subscribe(
      guias => {
        this.guias = guias;
        let dataGuiasPorProcesar = [];
        guias.forEach(guia => {
          dataGuiasPorProcesar.push({
            nroGuia: guia.numeroGuia,
            sede: guia.sede.nombre,
            plazo: guia.plazoDistribucion.nombre,
            tipoServicio: guia.tipoServicio.nombre,
            tipoSeguridad: guia.tipoSeguridad.nombre,
            fechaEnvio: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2).fecha : " ",
            fechalimite: guia.fechaLimite ? guia.fechaLimite : ' ',
            total: guia.cantidadDocumentos,
            entregados: guia.cantidadEntregados,
            rezagados: guia.cantidadRezagados,
            nodistribuibles: guia.cantidadNoDistribuibles,
            pendientesResultado: guia.cantidadPendientes,
            fechadescarga: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3).fecha : " ",
          })
        })
        this.dataGuiasPorProcesar.load(dataGuiasPorProcesar);
      },
      error => {
        if (error.status === 400) {
          this.guias = [];
          this.notifier.notify('error', 'No hay resultados');
        }
      }
    )
  }

  descargarGuia(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)

    this.guiaService.listarDocumentosByGuiaId(guia).subscribe(
      documentos => {
        this.documentos = documentos;
        this.guiaService.exportarDocumentosGuia(documentos, guia)
        if (!this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3)) {
          this.guiaService.asignarFechaDescarga(guia).subscribe(guia => {
            this.listarGuiasPorProcesar();
          },
            error => console.log(error));
        }
      }
    )
  }

  onChangeExcelFile(file: File) {
    if (file == null) {
      this.excelFile = null;
      this.resultadosCorrectos = [];
      this.resultadosIncorrectos = [];
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }

  importarExcel() {
    if (this.excelFile == null) {
      return null;
    }
    if (this.resultadosIncorrectos.length > 0) {
      this.mostrarResultadosCargados2(this.excelFile);
      return;
    }
    this.mostrarResultadosCargados(this.excelFile);
  }

  mostrarResultadosCargados(file: File) {
    this.documentoService.validarResultadosDelProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.resultadosCorrectos = data.documentos;
        this.resultadosIncorrectos = data.inconsistenciasResultado;
        if (this.resultadosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.resultadosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  mostrarResultadosCargados2(file: File) {
    this.documentoService.validarResultadosDelProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        console.log("primeros correctos: " + this.resultadosCorrectos.length)
        console.log("nuevos correctos: " + data.documentos.length)
        this.resultadosCorrectos = this.resultadosCorrectos.concat(data.documentos);
        this.resultadosIncorrectos = data.inconsistenciasResultado;
        // descargar inconsistencias
        if (this.resultadosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.resultadosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  descargarInconsistencias(inconsistencias: InconsistenciaResultado[]) {
    this.documentoService.exportarInconsistenciasResultadosProveedor(inconsistencias);
  }

  onSubmit(procesarForm: FormGroup) {
    if (this.resultadosIncorrectos.length > 0) {
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          titulo: "Confirmación de registros",
          mensaje: "Solo se subirán " + this.resultadosCorrectos.length + " registros correctos"
        }
      });

      bsModalRef.content.confirmarEvent.subscribe(
        () => {
          this.registrarResultado();
        }
      )
    } else {
      this.registrarResultado();
    }
  }

  registrarResultado() {

    this.documentoService.subirReporte(this.resultadosCorrectos).subscribe(
      respuesta => {
        this.notifier.notify('success', respuesta.mensaje);
        this.procesarForm.reset();
        this.resultadosCorrectos = [];
        this.resultadosIncorrectos = [];
        // this.bsModalRef.hide();
        this.listarGuiasPorProcesar();
        // this.confirmarEvent.emit();
      },
      error => {
        this.notifier.notify('error', error.error.mensaje);
      }
    )
  }











  // subirGuia(row) {
  //   let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)
  //   let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
  //     initialState: {
  //       condicion: "procesar",
  //       documento: this.documento,
  //       guia: guia,
  //       titulo: 'Subir reporte de Guía.',
  //       mensaje: 'Seleccione el reporte perteneciente a los documentos de la guía.'
  //     },
  //     class: 'modal-lg',
  //     keyboard: false,
  //     backdrop: "static"
  //   });

  //   this.modalService.onHide.subscribe(
  //     () => {
  //       this.listarGuiasPorProcesar();
  //     }
  //   )
  // }




}
