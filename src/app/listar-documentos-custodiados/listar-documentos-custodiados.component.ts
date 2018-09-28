import { Documento } from './../../model/documento.model';
import { DocumentoService } from './../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-listar-documentos-custodiados',
  templateUrl: './listar-documentos-custodiados.component.html',
  styleUrls: ['./listar-documentos-custodiados.component.css']
})
export class ListarDocumentosCustodiadosComponent implements OnInit {

  constructor(
    private documentoService: DocumentoService
  ) { }

  documentosCustodiados: Documento[] = [];
  listarDocumentosCustodiadosSubscription: Subscription;

  ngOnInit() {
    this.listarDocumentoCustodiados();
  }

  listarDocumentoCustodiados(){
    this.listarDocumentosCustodiadosSubscription = this.documentoService.listarDocumentosCustodiados().subscribe(
      documentosCustodiados => this.documentosCustodiados = documentosCustodiados
    )
  }

  


}
