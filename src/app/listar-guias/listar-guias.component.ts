import { ValidarDocumentosGuiaModalComponent } from './validar-documentos-guia-modal/validar-documentos-guia-modal.component';
import { Guia } from './../../model/guia.model';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GuiaService } from './../shared/guia.service';
import { CrearGuiaModalComponent } from './crear-guia-modal/crear-guia-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-listar-guias',
  templateUrl: './listar-guias.component.html',
  styleUrls: ['./listar-guias.component.css']
})
export class ListarGuiasComponent implements OnInit, OnDestroy {

  constructor(
    private modalService: BsModalService,
    public guiaService: GuiaService
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


  ngOnDestroy() {
    this.guiasCreadasSubscription.unsubscribe();
  }



}
