import { CargoPdfService } from './../shared/cargo-pdf.service';
import { NotifierService } from 'angular-notifier';
import { Documento } from '../../model/documento.model';
import { UtilsService } from '../shared/utils.service';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { EnvioService } from '../shared/envio.service';
import { Envio } from '../../model/envio.model';
import { AppSettings } from '../shared/app.settings';


@Component({
  selector: 'app-custodiar-documentos',
  templateUrl: './custodiar-documentos-individuales.component.html',
  styleUrls: ['./custodiar-documentos-individuales.component.css']
})
export class CustodiarDocumentosIndividualesComponent implements OnInit {

  constructor(
    public envioService: EnvioService,
    public documentoService: DocumentoService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private cargoPdfService: CargoPdfService
  ) { }

  enviosCreados: Envio[] = [];
  documentoAutogenerado: string = "";
  settings = AppSettings.tableSettings;

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

  seleccionar(documentoAutogenerado: string) {
    let encuentra = false;
    this.enviosCreados.forEach(
      envioCreado => {
        if (envioCreado.documentos[0].documentoAutogenerado === documentoAutogenerado) {
          envioCreado.checked = true;
          encuentra = true;
          this.documentoAutogenerado = "";
          return;
        }
      }
    )
    if (!encuentra) {
      this.notifier.notify('warning', 'No se encuentra el código');
    }
  }

  onCustodiar() {
    this.custodiar();
  }


  custodiar(success: Function = null) {

    let documentosACustodiar = this.getDocumentosACustodiar();

    if (documentosACustodiar.length === 0) {
      this.notifier.notify('warning', 'Seleccione los documentos que va a custodiar');
      return;
    }

    this.documentoService.custodiarDocumentos(documentosACustodiar).subscribe(
      respuesta => {
        this.notifier.notify('success', 'Documentos custodiados');
        this.listarDocumentosIndividualesPorCustodiar();
        if (success !== null) {
          success(documentosACustodiar);
        }
      },
      error => {
        console.log(error);
      })

  }


  onCustodiarEtiqueta() {
    this.custodiar(documentosACustodiar => {
      let codigosBarra = this.getCodigoBarrasDocumentosACustodiar(documentosACustodiar);
      this.cargoPdfService.generarPDFsEtiqueta(codigosBarra);
    });
  }

  onCustodiarCargo() {
    this.custodiar(documentosACustodiar => {
      let codigosBarra = this.getCodigoBarrasDocumentosACustodiar(documentosACustodiar);
      this.cargoPdfService.generarPDFsCargo(codigosBarra, documentosACustodiar);
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
    this.enviosCreados.forEach(envioCreado => {
      if (!this.utilsService.isUndefinedOrNullOrEmpty(envioCreado.checked)
        && envioCreado.checked === true) {
        documentosACustodiar.push({
          id: envioCreado.documentos[0].id,
          documentoAutogenerado: envioCreado.documentos[0].documentoAutogenerado,
          envioInfo: envioCreado
        });
      }
    });
    return documentosACustodiar;
  }
}
