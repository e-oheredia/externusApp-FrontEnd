import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoService } from '../shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-recepcionar-cargos',
  templateUrl: './recepcionar-cargos.component.html',
  styleUrls: ['./recepcionar-cargos.component.css']
})


export class RecepcionarCargosComponent implements OnInit {

  constructor(public documentoService: DocumentoService, private notifier: NotifierService) {

  }

  documentos: Documento[] = [];
  documentosSubscription: Subscription;
  documentoForm: FormGroup;



  ngOnInit() {
    this.documentoForm = new FormGroup({ codigo: new FormControl('', Validators.required) });
    this.listarCargosPendientes();
  }


  listarCargosPendientes() {
    this.documentosSubscription = this.documentoService.listarDocumentosEntregados().subscribe(
      documentos => this.documentos = documentos,
      error => {
        if (error.status === 404) {
          this.documentos = [];
        }
      }
    );
  }



  recepcionarCargo() {

    if (this.documentoForm.controls['codigo'].value.length !== 0) {

      let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === this.documentoForm.controls['codigo'].value);

      if (documento === undefined) {
        this.notifier.notify('error', 'NO SE HA ENCONTRADO EL CODIGO INGRESADO');
      } else if (this.documentoForm.controls['codigo'].value.length !== 0) {
        this.documentoService.recepcionarCargo(documento.id).subscribe(
          documentos => {
            this.documentos = this.documentos
            this.notifier.notify('success', 'CARGO RECEPCIONADO');
            this.documentoForm.controls['codigo'].setValue('');
            this.listarCargosPendientes();
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

