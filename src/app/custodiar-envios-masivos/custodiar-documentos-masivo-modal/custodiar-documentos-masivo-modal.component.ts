import { DocumentoService } from '../../shared/documento.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Envio } from '../../../model/envio.model';
import { UtilsService } from '../../shared/utils.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-custodiar-documentos-masivo-modal',
  templateUrl: './custodiar-documentos-masivo-modal.component.html',
  styleUrls: ['./custodiar-documentos-masivo-modal.component.css']
})
export class CustodiarDocumentosMasivoModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef, 
    public documentoService: DocumentoService, 
    private utilsService: UtilsService, 
    private notifier: NotifierService
  ) { }

  envio: Envio;
  documentoAutogenerado = "";
  @Output() todosDocumentosCustodiadosEvent = new EventEmitter();

  ngOnInit() {

    this.envio.documentos = this.envio.documentos.filter( 
      documento => 
        this.documentoService.getUltimoEstado(documento).id === 1
    );
  }

  seleccionar(documentoAutogenerado: string){
    let encuentra = false;
    this.envio.documentos.forEach(      
      documento => {
        if (documento.documentoAutogenerado === documentoAutogenerado ) {
          documento.checked = true;
          encuentra = true;
          this.documentoAutogenerado = "";
          return;
        }
      }
    )
    if (!encuentra) {
      this.notifier.notify('warning','No se encuentra el código');
    }
  }

  custodiar() {
    let documentosACustodiar = [];
    this.envio.documentos.forEach(documento => {
      if (!this.utilsService.isUndefinedOrNullOrEmpty(documento.checked)
        && documento.checked === true) {
        documentosACustodiar.push({
          id: documento.id
        });
      }
    });

    if (documentosACustodiar.length === 0) {
      this.notifier.notify('warning', 'Seleccione los documentos que va a custodiar');
      return;
    }

    this.documentoService.custodiarDocumentos(documentosACustodiar).subscribe(
      respuesta => {
        this.notifier.notify('success', 'Se han custodiado correctamente los documentos seleccionados');
        let resto = [];
        this.envio.documentos.forEach(documento => {          
          if (documentosACustodiar.findIndex(doc => documento.id === doc.id) === -1) {
            resto.push(documento);
          }
        });
        if (resto.length === 0) {
          this.todosDocumentosCustodiadosEvent.emit();
          this.bsModalRef.hide();
          return;
        }
        this.envio.documentos = resto;
      },
      error => {
        console.log(error);
      })

  }

}
