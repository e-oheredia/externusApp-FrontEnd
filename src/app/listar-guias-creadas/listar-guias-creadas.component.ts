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

  guiasCreadas = [];
  guiasCreadasSubscription: Subscription;


  ngOnInit() {
    this.listarGuiasCreadas();
  }

  crearGuia() {
    let bsModalRef: BsModalRef = this.modalService.show(CrearGuiaModalComponent);
    bsModalRef.content.guiaCreadaEvent.subscribe(
      guiaCreada => {
        this.listarGuiasCreadas();
        this.abrirGuia(guiaCreada);
      }
    )
  }

  modificar(guia: Guia) {
    let bsModalRef: BsModalRef = this.modalService.show(ModificarGuiaModalComponent, {
      initialState: {
        guia: guia
      }
    });


    bsModalRef.content.guiaModificadaEvent.subscribe(
      () => {
        this.listarGuiasCreadas();
      }
    )
  }

  eliminar(guiaId: number) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: "Se eliminará la guía ¿Desea continuar?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(
      () => {
        this.guiaService.eliminarGuia(guiaId).subscribe(
          () => {
            this.notifier.notify('success', 'Se ha eliminado correctamente la guía');
            this.listarGuiasCreadas();
          },
          error => {
            console.log(error);
          }
        )
      }
    )

  }

  listarGuiasCreadas() {
    this.guiasCreadasSubscription = this.guiaService.listarGuiasCreadas().subscribe(
      guiasCreadas => this.guiasCreadas = guiasCreadas
    );
  }

  abrirGuia(guia: Guia) {
    let bsModalRef: BsModalRef = this.modalService.show(ValidarDocumentosGuiaModalComponent, {
      initialState: {
        guia: guia
      },
      class: 'modal-lg'
    });

    this.modalService.onHidden.subscribe(
      () => {
        this.listarGuiasCreadas();
      }
    );
  }

  enviar(guia: Guia) {
    if (guia.cantidadDocumentos - guia.cantidadValidados !== 0) {
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
        this.guiaService.enviarGuia(guia.id).subscribe(
          guia => {
            this.notifier.notify('success', 'Se ha enviado correctamente la guía');
            this.listarGuiasCreadas();
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
