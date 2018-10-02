import { NotifierService } from 'angular-notifier';
import { Documento } from '../../model/documento.model';
import { UtilsService } from '../shared/utils.service';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../shared/envio.service';
import { Envio } from '../../model/envio.model';

@Component({
  selector: 'app-custodiar-documentos',
  templateUrl: './custodiar-documentos-individuales.component.html',
  styleUrls: ['./custodiar-documentos-individuales.component.css']
})
export class CustodiarDocumentosIndividualesComponent implements OnInit {

  constructor(
    private envioService: EnvioService,
    public documentoService: DocumentoService,
    private utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  enviosCreados: Envio[] = [];
  documentoAutogenerado: string = "";

  ngOnInit() {

    this.listarDocumentosIndividualesPorCustodiar();
  }

  listarDocumentosIndividualesPorCustodiar() {
    this.envioService.listarEnviosIndividualesCreados().subscribe(
      data => {
        this.enviosCreados = data;
      },
      error => {
        console.log(error);
      })
  }

  seleccionar(documentoAutogenerado: string){
    let encuentra = false;
    this.enviosCreados.forEach(      
      envioCreado => {
        if (envioCreado.documentos[0].documentoAutogenerado === documentoAutogenerado ) {
          envioCreado.checked = true;
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
    this.enviosCreados.forEach(envioCreado => {
      if (!this.utilsService.isUndefinedOrNullOrEmpty(envioCreado.checked)
        && envioCreado.checked === true) {
        documentosACustodiar.push({
          id: envioCreado.documentos[0].id
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
        this.listarDocumentosIndividualesPorCustodiar();  
      },
      error => {
        console.log(error);
      })

  }

}
