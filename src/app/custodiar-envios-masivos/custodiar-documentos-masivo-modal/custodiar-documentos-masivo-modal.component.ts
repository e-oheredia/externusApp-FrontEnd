import { CargoPdfService } from './../../shared/cargo-pdf.service';
import { DocumentoService } from '../../shared/documento.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Envio } from '../../../model/envio.model';
import { UtilsService } from '../../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { EnvioMasivoService } from 'src/app/shared/enviomasivo.service';
import { Documento } from 'src/model/documento.model';

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
    private notifier: NotifierService, 
    private cargoPdfService: CargoPdfService,
    private envioMasivoService: EnvioMasivoService
  ) { }

  envio: Envio;
  documentos: Documento[] = [];
  documentoAutogenerado = "";
  @Output() todosDocumentosCustodiadosEvent = new EventEmitter();

  ngOnInit() {
    this.listarDocumentosDeLaGuia(this.envio.id);
  }

  listarDocumentosDeLaGuia(id){
    this.envioMasivoService.getDocumentosByEnvioId(id).subscribe(
      documentos => {
        this.documentos = documentos;
        // this.envio.documentos.push(this.documentos)
      }
    )
  }

  seleccionar(documentoAutogenerado: string){
    let encuentra = false;
    this.documentos.forEach(      
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

  custodiar(success: Function = null) {    
    let documentosACustodiar = this.getDocumentosACustodiar();

    if (documentosACustodiar.length === 0) {
      this.notifier.notify('warning', 'Seleccione los documentos que va a custodiar');
      return;
    }
    this.documentoService.custodiarDocumentos(documentosACustodiar).subscribe(
      respuesta => {
        this.notifier.notify('success', 'Se han custodiado correctamente los documentos seleccionados');
        let resto = [];
        this.documentos.forEach(documento => {          
          if (documentosACustodiar.findIndex(doc => documento.id === doc.id) === -1) {
            resto.push(documento);
          }
        });
        if (success !== null) {
          success(documentosACustodiar);
        }
        if (resto.length === 0) {
          this.todosDocumentosCustodiadosEvent.emit();
          this.bsModalRef.hide();
          return;
        }
        this.documentos = resto;
        
      },
      error => {
        console.log(error);
      })

  }

  onCustodiar() {
    this.custodiar();
  }

  onCustodiarCargo() {
    this.custodiar(documentosACustodiar => {
      let codigosBarra = this.getCodigoBarrasDocumentosACustodiar(documentosACustodiar);
      this.cargoPdfService.generarPDFsCargo(codigosBarra, documentosACustodiar);
    });
  }

  onCustodiarEtiqueta() {
    this.custodiar(documentosACustodiar => {
      let codigosBarra = this.getCodigoBarrasDocumentosACustodiar(documentosACustodiar);
      this.cargoPdfService.generarPDFsEtiqueta(codigosBarra);
    });
  }

  getCodigoBarrasDocumentosACustodiar(documentosACustodiar) {
    let codigos = [];
    documentosACustodiar.forEach(documentoACustodiar => {
      codigos.push(document.getElementById(documentoACustodiar.documentoAutogenerado).children[0].children[0]);
    });
    return codigos;
  }

  getDocumentosACustodiar() {
    let documentosACustodiar = [];
    this.documentos.forEach(documento => {
      let envioInfo = Object.assign({}, this.envio);
      envioInfo.documentos = [];
      envioInfo.documentos.push(documento);
      if (!this.utilsService.isUndefinedOrNullOrEmpty(documento.checked)
        && documento.checked === true) {
        documentosACustodiar.push({
          id: documento.id,
          documentoAutogenerado: documento.documentoAutogenerado,
          envioInfo: envioInfo
        });
      }
    });
    return documentosACustodiar;
  }

}
