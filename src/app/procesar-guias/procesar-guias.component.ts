import { Component, OnInit } from '@angular/core';
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
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';
import { Documento } from 'src/model/documento.model';

@Component({
  selector: 'app-procesar-guias',
  templateUrl: './procesar-guias.component.html',
  styleUrls: ['./procesar-guias.component.css']
})
export class ProcesarGuiasComponent implements OnInit {

  constructor(
    public guiaService: GuiaService,
    public documentoService: DocumentoService,
    private notifier: NotifierService,
    private modalService: BsModalService
  ) { }

  dataGuiasPorProcesar: LocalDataSource = new LocalDataSource();
  rutaPlantillaResultados: string = AppSettings.PLANTILLA_RESULTADOS;
  settings = AppSettings.tableSettings;

  guias: Guia[] = [];
  documento: Documento;
  documentos: Documento[] = [];

  guiasSubscription: Subscription;
  estadoDocumentoForm = EstadoDocumentoEnum;

  ngOnInit() {
    this.generarColumnas();
    this.listarGuiasPorProcesar();
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
      },
      subirBase: {
        title: 'Subir Resultado',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-upload";
          instance.pressed.subscribe(row => {
            this.subirGuia(row);
          });
        }
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
            fechaEnvio: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2).fecha : "",
            fechalimite: '',
            total: guia.cantidadDocumentos,
            entregados: guia.cantidadEntregados,
            rezagados: guia.cantidadRezagados,
            nodistribuibles: guia.cantidadNoDistribuibles,
            pendientesResultado: guia.cantidadPendientes,
            fechadescarga: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3).fecha : "",
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


  subirGuia(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
      initialState: {
        condicion: "procesar",
        documento: this.documento,
        guia: guia,
        titulo: 'Subir reporte de Guía.',
        mensaje: 'Seleccione el reporte perteneciente a los documentos de la guía.'
      },
      class: 'modal-lg',
      keyboard: false,
      backdrop: "static"
    });

    this.modalService.onHide.subscribe(
      () => {
        this.listarGuiasPorProcesar();
      }
    )
  }




}
