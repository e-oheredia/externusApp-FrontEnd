import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoService } from '../shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-recepcionar-documentos',
  templateUrl: './recepcionar-documentos.component.html',
  styleUrls: ['./recepcionar-documentos.component.css']
})
export class RecepcionarDocumentosComponent implements OnInit {

  constructor(public documentoService: DocumentoService, private notifier: NotifierService) {

  }

  documentos: Documento[] = [];
  documentosSubscription: Subscription;
  documentoForm: FormGroup;

  ngOnInit() {
    this.documentoForm = new FormGroup({ codigo: new FormControl('', Validators.required) });
    this.listarDocumentosPendientes();
  }


  listarDocumentosPendientes() {
    this.documentosSubscription = this.documentoService.listarDocumentosPorDevolver().subscribe(
      documentos => this.documentos = documentos,
      error => {
        if (error.status === 404) {
          this.documentos = [];
        }
      }
    );
  }


  recepcionarDocumento(codigo) {

    if (codigo.length !== 0) {

      let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === codigo);

      if (documento === undefined) {
        this.notifier.notify('error', 'NO SE HA ENCONTRADO EL CODIGO INGRESADO');
      } else if (codigo !== 0) {
        this.documentoService.recepcionarDocumento(documento.id).subscribe(
          documento => {
            this.notifier.notify('success', 'DOCUMENTO RECEPCIONADO');
            this.documentoForm.controls['codigo'].setValue('');
            this.listarDocumentosPendientes();
          },
          error => {
            if (error.status === 404) {
              this.documentos = [];
              this.notifier.notify('error', 'ERROR EN BACK NO MAPEADO');
            }
          }
        );
      }

    }
    else {
      this.notifier.notify('error', 'CODIGO VACIO');
      console.log(this.documentoForm.controls['codigo'].value);
    }
  }






}
