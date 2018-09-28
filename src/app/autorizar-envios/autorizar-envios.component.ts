import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DocumentoService } from '../shared/documento.service';
import { EnvioService } from '../shared/envio.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-autorizar-envios',
  templateUrl: './autorizar-envios.component.html',
  styleUrls: ['./autorizar-envios.component.css'],
  entryComponents: [
    ConfirmModalComponent
    ]
})
export class AutorizarEnviosComponent implements OnInit {

  constructor(private envioService: EnvioService, public documentoService: DocumentoService, private notifier: NotifierService, private modalService: BsModalService) { }
  enviosNoAutorizados = [];

  ngOnInit() {
    this.listarEnviosNoAutorizados();
  }

  listarEnviosNoAutorizados(){
    this.envioService.listarEnviosNoAutorizados().subscribe(
      envios => {
        this.enviosNoAutorizados = envios;
      }
    )
  }

  autorizar(id: number) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState : {
        mensaje: "¿Está seguro que desea autorizar el envío?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.envioService.autorizarEnvio(id).subscribe(
        () => {
          this.notifier.notify('success', 'Se ha autorizado correctamente el envío');
          this.listarEnviosNoAutorizados();
        },
        error => {
          console.log(error);
        }
      )
    });    
  }

  denegar(id: number) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState : {
        mensaje: "¿Está seguro que desea denegar el envío?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.envioService.denegarEnvio(id).subscribe(
        () => {
          this.notifier.notify('success', 'Se ha denegado correctamente el envío');
          this.listarEnviosNoAutorizados();
        },
        error => {
          console.log(error);
        }
      )
    });
    
  }
}
