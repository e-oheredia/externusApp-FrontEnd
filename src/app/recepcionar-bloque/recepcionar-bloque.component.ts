import { Component, OnInit } from '@angular/core';
import { GuiaService } from '../shared/guia.service';
import { DocumentoService } from '../shared/documento.service';
import { NotifierService } from 'angular-notifier';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Guia } from 'src/model/guia.model';
import { Documento } from 'src/model/documento.model';
import { Subscription } from 'rxjs';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';

@Component({
  selector: 'app-recepcionar-bloque',
  templateUrl: './recepcionar-bloque.component.html',
  styleUrls: ['./recepcionar-bloque.component.css']
})
export class RecepcionarBloqueComponent implements OnInit {

  constructor(
    private guiaService: GuiaService,
    public documentoService: DocumentoService,
    private notifier: NotifierService,
    private modalService: BsModalService
  ) { }

  dataDevolucionesDeBloque: LocalDataSource = new LocalDataSource();
  rutaPlantillaResultados: string = AppSettings.PLANTILLA_DEVUELTOS;
  settings = AppSettings.tableSettings;

  guias: Guia[] = [];

  guiasSubscription: Subscription;
  estadoDocumentoForm = EstadoDocumentoEnum;

  ngOnInit() {
    this.generarColumnas();
    this.listarGuiasPorProcesar();
    this.settings.hideSubHeader = false;
  }

  generarColumnas() {
    this.settings.columns = {
      fechaEnvio: {
        title: 'Fecha de envío'
      },
      nroGuia: {
        title: 'Número de guía'
      },
      plazoDistribucion: {
        title: 'Plazo de distribución'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      tipoSeguridad: {
        title: 'Tipo de seguridad'
      },
      fechaLimiteResultado: {
        title: 'Fecha límite de resultado'
      },
      descargarResultado: {
        title: 'Descargar resultado',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.pressed.subscribe(row => {
            this.descargarBase(row);
          });
        }
      },
      entregados: {
        title: 'Entregados'
      },
      rezagados: {
        title: 'Rezagados'
      },
      noDistribuibles: {
        title: 'No distribuibles'
      },
      total: {
        title: 'Total'
      },
      subirDevoluciones: {
        title: 'Subir devoluciones',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-upload";
          instance.pressed.subscribe(row => {
            this.subirResultados(row);
          });
        }
      },
    }
  }

  descargarBase(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)

    this.guiaService.listarDocumentosByGuiaId(guia).subscribe(
      documentos => {
        this.guiaService.exportarResultadosGuia(documentos, guia)
        if (!this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3)) {
          this.guiaService.asignarFechaDescarga(guia).subscribe(guia => {
            this.listarGuiasPorProcesar();
          },
            error => console.log(error));
        }
      }
    )
  }

  subirResultados(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
      initialState: {
        condicion: "recepcionar",
        guia: guia,
        titulo: 'Subir resultado.',
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

  listarGuiasPorProcesar() {
    this.guiasSubscription = this.guiaService.listarGuiasBloquePorCerrar().subscribe(
      guias => {
        this.guias = guias;
        let dataDevolucionesDeBloque = [];
        guias.forEach(
          guia => {
            dataDevolucionesDeBloque.push({
              fechaEnvio: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 2).fecha : "",
              nroGuia: guia.numeroGuia,
              plazoDistribucion: guia.plazoDistribucion.nombre,
              tipoServicio: guia.tipoServicio.nombre,
              tipoSeguridad: guia.tipoSeguridad.nombre,
              fechaLimiteResultado: '',
              entregados: guia.cantidadEntregados,
              rezagados: guia.cantidadRezagados,
              noDistribuibles: guia.cantidadNoDistribuibles,
              total: guia.cantidadDocumentos
            })
          })
        this.dataDevolucionesDeBloque.load(dataDevolucionesDeBloque);
      },
      error => {
        if (error.status === 400) {
          this.guias = [];
          this.notifier.notify('error', 'no hay resultadosss');
        }
      }
    )
  }



}
