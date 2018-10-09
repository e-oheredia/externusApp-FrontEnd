import { Guia } from './../../model/guia.model';
import { GuiaService } from './../shared/guia.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from '../../../node_modules/angular-notifier';

@Component({
  selector: 'app-listar-guias-enviadas',
  templateUrl: './listar-guias-enviadas.component.html',
  styleUrls: ['./listar-guias-enviadas.component.css']
})
export class ListarGuiasEnviadasComponent implements OnInit {

  constructor(
    public guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  guiasEnviadas: Guia[] = [];



  ngOnInit() {
    this.listarGuiasEnviadas();
  }

  listarGuiasEnviadas() {
    this.guiaService.listarGuiasEnviadas().subscribe(
      guiasEnviadas => {
        this.guiasEnviadas = guiasEnviadas;
      }, 
      error => {
        console.log(error);
      }
    )
  }

  exportar(guia: Guia) {
    this.guiaService.exportarDocumentosGuia(guia);
  }

}
