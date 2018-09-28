import { ConfirmModalComponent } from './../../modals/confirm-modal/confirm-modal.component';
import { DocumentoGuia } from './../../../model/documentoguia.model';
import { Subscription } from 'rxjs';
import { DocumentoGuiaService } from './../../shared/documentoguia.service';
import { DocumentoService } from './../../shared/documento.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Guia } from './../../../model/guia.model';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from '../../../../node_modules/angular-notifier';
import { BsModalService } from '../../../../node_modules/ngx-bootstrap/modal';
import { GuiaService } from '../../shared/guia.service';

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

  validarDocumentoGuiaSubscription: Subscription;
  retirarNoValidadosSubscription: Subscription;

  ngOnInit() {

  }

  validar(documentoAutogenerado: string) {

    let documentoGuia: DocumentoGuia = this.guia.documentosGuia.find(documentoGuia => documentoGuia.documento.documentoAutogenerado === documentoAutogenerado);

    if (documentoGuia === undefined) {
      this.notifier.notify('warning', 'No se encontró el código');
      return;
    }

    if (documentoGuia.validado) {
      this.notifier.notify('warning', 'El documento ya se encuentra validado');
      return;
    }

    this.validarDocumentoGuiaSubscription = this.documentoGuiaService.validarDocumentoGuia(documentoGuia.id).subscribe(
      () => {
        this.notifier.notify('success', 'Se ha validado correctamente el documento');
        documentoGuia.validado = true;
      }
    );

  }

  retirarNoValidados() {

    let documentosValidadosGuia: DocumentoGuia[] =  this.guia.documentosGuia.filter(documentoGuia => documentoGuia.validado);

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState : {
        mensaje: documentosValidadosGuia.length === 0 ? "Se eliminará la entrega" : "" + "¿Está seguro que desea continuar?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.retirarNoValidadosSubscription = this.guiaService.retirarNoValidados(this.guia).subscribe(
        data => {
          console.log(data);
        }
      );
    });



  }

}
