import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { DocumentoGuia } from '../../../model/documentoguia.model';
import { Subscription } from 'rxjs';
import { DocumentoGuiaService } from '../../shared/documentoguia.service';
import { DocumentoService } from '../../shared/documento.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Guia } from '../../../model/guia.model';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GuiaService } from '../../shared/guia.service';
import { Documento } from 'src/model/documento.model';

@Component({
  selector: 'app-validar-documentos-guia-modal',
  templateUrl: './validar-documentos-guia-modal.component.html',
  styleUrls: ['./validar-documentos-guia-modal.component.css']
})
export class ValidarDocumentosGuiaModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public documentoService: DocumentoService,
    private documentoGuiaService: DocumentoGuiaService,
    private guiaService: GuiaService,
    private notifier: NotifierService,
    private modalService: BsModalService
  ) { }

  documentoAutogenerado = '';
  guia: Guia;
  documentos: Documento[] = [];
  validarDocumentoGuiaSubscription: Subscription;
  retirarNoValidadosSubscription: Subscription;

  ngOnInit() {
    this.listarDocumentosPorGuia();
  }

  listarDocumentosPorGuia() {
    this.guiaService.listarDocumentosByGuiaId(this.guia).subscribe(
      documentos => {
        this.documentos = documentos;
      }
    )
  }



  validar(documentoAutogenerado: string) {

    let documentoaValidar = this.documentos.find(documentosValidar => documentosValidar.documentoAutogenerado === documentoAutogenerado.toUpperCase());

    if (documentoaValidar === undefined) {
      this.notifier.notify('warning', 'No se encontró el código');
      return;
    }

    if (documentoaValidar.documentosGuia[0].validado) {
      this.notifier.notify('warning', 'El documento ya se encuentra validado');
      return;
    }

    this.validarDocumentoGuiaSubscription = this.documentoGuiaService.validarDocumentoGuia(this.guia.id, documentoaValidar.id).subscribe(
      () => {
        this.notifier.notify('success', 'Documento validado');
        this.documentoAutogenerado = "";
        documentoaValidar.documentosGuia[0].validado = true;
      }
    );

  }


  retirarNoValidados() {

    let documentosValidadosGuia: Documento[] = this.documentos.filter(documento => documento.documentosGuia[0].validado);

    let documentosNoValidadosGuia = this.documentos.length - documentosValidadosGuia.length

    if (documentosNoValidadosGuia === 0) {
      this.notifier.notify('info', 'Todos los documentos están validados');
      return
    }

    let mensajeInicial = documentosValidadosGuia.length === 0 ? "Se eliminará la entrega" : "Se retirarán los documentos no validados";
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: mensajeInicial + " ¿Está seguro que desea continuar?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.retirarNoValidadosSubscription = this.guiaService.retirarNoValidados(this.guia).subscribe(
        data => {
          this.notifier.notify('success', data.mensaje);
          this.documentos = documentosValidadosGuia;
          if (documentosValidadosGuia.length === 0) {
            this.bsModalRef.hide();
          }

        }
      );
    });



  }

}
