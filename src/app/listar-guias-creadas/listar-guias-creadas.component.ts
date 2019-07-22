import { ValidarDocumentosGuiaModalComponent } from './validar-documentos-guia-modal/validar-documentos-guia-modal.component';
import { Guia } from '../../model/guia.model';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GuiaService } from '../shared/guia.service';
import { CrearGuiaModalComponent } from './crear-guia-modal/crear-guia-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { ModificarGuiaModalComponent } from './modificar-guia-modal/modificar-guia-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { AppSettings } from '../shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';

@Component({
  selector: 'app-listar-guias-creadas',
  templateUrl: './listar-guias-creadas.component.html',
  styleUrls: ['./listar-guias-creadas.component.css']
})
export class ListarGuiasCreadasComponent implements OnInit, OnDestroy {

  constructor(
    private modalService: BsModalService,
    public guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  dataEnvios: LocalDataSource = new LocalDataSource();
  guiasCreadas = [];
  guiasCreadasSubscription: Subscription;
  settings = AppSettings.tableSettings;
  guias: Guia[] = [];
  guia: Guia;
  ngOnInit() {
    this.generarColumnas();
    this.listarSinCustodiar();
    this.settings.hideSubHeader = false;

  }


  generarColumnas() {
    this.settings.columns = {
      buttonValidar: {
        title: 'Validar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-vote-yea text-primary  pointable";
          instance.pressed.subscribe(row => {
            this.abrirGuia(row);
          });
        }
      },
      numero: {
        title: 'Número de Guía'
      },
      proveedor: {
        title: 'Proveedor'
      },
      plazo: {
        title: 'Plazo de Distribución'
      },
      servicio: {
        title: 'Tipo de Servicio'
      },
      seguridad: {
        title: 'Tipo de Seguridad'
      },
      total: {
        title: 'Total de Documentos'
      },
      validados: {
        title: 'Validados'
      },
      buttonEnviar: {
        title: 'Enviar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "oi oi-location text-success pointable";
          instance.pressed.subscribe(row => {
            this.enviar(row);
          });
        }
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "oi oi-pencil text-warning pointable";
          instance.pressed.subscribe(row => {
            this.modificar(row);
          });
        }
      },
      buttonEliminar: {
        title: 'Eliminar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "oi oi-x text-danger pointable";
          instance.pressed.subscribe(row => {
            this.eliminar(row);
          });
        }
      }
    }
  }


  listarSinCustodiar() {
    this.dataEnvios.reset();
    this.guiaService.listarGuiasRegularCreadas().subscribe(
      guias => {
        this.guias = guias;
        let dataEnvios = [];
        guias.forEach(
          guia => {
            dataEnvios.push({
              id: guia.id,
              numero: guia.numeroGuia,
              proveedor: guia.proveedor.nombre,
              plazo: guia.plazoDistribucion.nombre,
              servicio: guia.clasificacion.nombre,
              seguridad: guia.tipoSeguridad.nombre,
              total: guia.cantidadDocumentos,
              validados: guia.cantidadValidados
            })
          }
        )
        this.dataEnvios.load(dataEnvios);
      }
    )
  }



  crearGuia() {
    let bsModalRef: BsModalRef = this.modalService.show(CrearGuiaModalComponent);
    bsModalRef.content.guiaCreadaEvent.subscribe(
      guiaCreada => {
        this.listarSinCustodiar();
        this.abrirGuiaalcrear(guiaCreada);
      }
    )
  }

  modificar(row) {
    this.guia = this.guias.find(guia => guia.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarGuiaModalComponent, {
      initialState: {
        guia: this.guia
      }
    });


    bsModalRef.content.guiaModificadaEvent.subscribe(
      () => {
        this.listarSinCustodiar();
      }
    )
  }

  eliminar(row) {
    this.guia = this.guias.find(guia => guia.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        id: this.guia.id,
        mensaje: "Se eliminará la guía ¿Desea continuar?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(
      () => {
        this.guiaService.eliminarGuia(this.guia.id).subscribe(
          () => {
            this.notifier.notify('success', 'Se ha eliminado correctamente la guía');
            this.listarSinCustodiar();
          },
          error => {
            console.log(error);
          }
        )
      });

  }

  listarGuiasCreadas() {
    this.guiasCreadasSubscription = this.guiaService.listarGuiasRegularCreadas().subscribe(
      guiasCreadas => this.guiasCreadas = guiasCreadas
    );
  }

  abrirGuia(row) {
    this.guia = this.guias.find(guia => guia.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ValidarDocumentosGuiaModalComponent, {
      initialState: {
        guia: this.guia
      },
      class: 'modal-lg'
    });

    this.modalService.onHidden.subscribe(
      () => {
        this.listarSinCustodiar();
      }
    );
  }


  abrirGuiaalcrear(guia: Guia) {
    let bsModalRef: BsModalRef = this.modalService.show(ValidarDocumentosGuiaModalComponent, {
      initialState: {
        guia: guia
      },
      class: 'modal-lg'
    });

    this.modalService.onHidden.subscribe(
      () => {
        this.listarSinCustodiar();
      }
    );
  }

  enviar(row) {
    this.guia = this.guias.find(guia => guia.id == row.id)
    if (this.guia.cantidadDocumentos - this.guia.cantidadValidados !== 0) {
      this.notifier.notify('error', 'Valide todos los documentos de la guía antes de enviar');
      return;
    }

    let bsModalRef: BsModalRef = this.modalService.show(
      ConfirmModalComponent, {
        initialState: {
          mensaje: "Se enviará la guía ¿Desea continuar?"
        }
      });

    bsModalRef.content.confirmarEvent.subscribe(
      () => {
        this.guiaService.enviarGuiaRegular(this.guia.id).subscribe(
          guia => {
            this.notifier.notify('success', 'Se ha enviado correctamente la guía');
            this.listarSinCustodiar();
          },
          error => {
            console.log(error);
          }
        )
      }
    )



  }

  ngOnDestroy() {
    this.guiasCreadasSubscription.unsubscribe();
  }



}
