import { DocumentoService } from './../../shared/documento.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit } from '@angular/core';
import { Envio } from '../../../model/envio.model';
import { UtilsService } from '../../shared/utils.service';
import { NotifierService } from '../../../../node_modules/angular-notifier';

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

  ngOnInit() {

    this.envio.documentos = this.envio.documentos.filter( 
      documento => 
        this.documentoService.getUltimoEstado(documento).id === 1
    );
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
        this.envio.documentos = resto;
      },
      error => {
        console.log(error);
      })

  }

}
