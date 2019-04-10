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
  rutaPlantillaResultados: string = AppSettings.PANTILLA_RESULTADOS;
  settings = AppSettings.tableSettings;

  guias: Guia[] = [];
  guia: Guia;
  documento: Documento;

  guiasSubscription: Subscription;
  estadoDocumentoForm = EstadoDocumentoEnum;

  ngOnInit() {
    this.generarColumnas();
    this.listarGuiasPorProcesar();
    this.settings.hideSubHeader = false;
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
    this.guiasSubscription = this.guiaService.listarGuiasPorProcesar()
      .subscribe(
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
              total: guia.documentosGuia.length,
              entregados: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.ENTREGADO).length,
              rezagados: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.REZAGADO).length,
              nodistribuibles: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.NO_DISTRIBUIBLE).length,
              pendientesResultado: this.guiaService.listarDocumentosGuiaByUltimoEstadoAndGuia(guia, EstadoDocumentoEnum.ENVIADO).length,
              fechadescarga: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia,3) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia,3).fecha : "",
              // fechadescarga: this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3) ? this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3).fecha : "",
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


  descargarGuia(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)
    this.guiaService.exportarDocumentosGuia(guia)
    if(!this.guiaService.getSeguimientoGuiaByEstadoGuiaId(guia, 3)){
      this.guiaService.asignarFechaDescarga(guia).subscribe(guia => {
        this.listarGuiasPorProcesar();
      }, 
      error => console.log(error));
  }

  }


  subirGuia(row) {
    let guia = this.guias.find(guia => guia.numeroGuia == row.nroGuia)
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarArchivoComponent, {
      initialState: {
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
