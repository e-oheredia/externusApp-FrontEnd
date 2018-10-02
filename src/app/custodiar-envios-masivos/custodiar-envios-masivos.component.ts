import { CustodiarDocumentosMasivoModalComponent } from './custodiar-documentos-masivo-modal/custodiar-documentos-masivo-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EnvioMasivoService } from '../shared/enviomasivo.service';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-custodiar-envios-masivos',
  templateUrl: './custodiar-envios-masivos.component.html',
  styleUrls: ['./custodiar-envios-masivos.component.css'],
  entryComponents: [
    CustodiarDocumentosMasivoModalComponent
  ]
})
export class CustodiarEnviosMasivosComponent implements OnInit {

  constructor(
    private envioMasivoService: EnvioMasivoService,
    public documentoService: DocumentoService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  enviosMasivosCreados = [];
  masivoAutogenerado = "";

  ngOnInit() {
    this.listarEnviosMasivosPorCustodiar();
  }

  listarEnviosMasivosPorCustodiar() {
    this.envioMasivoService.listarEnviosMasivosCreados().subscribe(
      enviosMasivosCreados => {
        this.enviosMasivosCreados = enviosMasivosCreados;
      }
    )
  }

  abrir(masivoAutogenerado: string) {

    let envio = this.enviosMasivosCreados.find(
      envio => envio.masivoAutogenerado === masivoAutogenerado);

    if (this.utilsService.isUndefinedOrNullOrEmpty(envio)) {
      this.notifier.notify('warning', 'No existe el código ingresado');
      return;
    }

    this.masivoAutogenerado = "";

    let bsModalRef: BsModalRef = this.modalService.show(CustodiarDocumentosMasivoModalComponent, {
      initialState: {
        envio: envio
      },
      class: "modal-lg"
    });

    bsModalRef.content.todosDocumentosCustodiadosEvent.subscribe(
      () => {
        this.listarEnviosMasivosPorCustodiar();
      }
    );
  }

}
