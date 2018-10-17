import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-consultar-documentos-utd-bcp',
  templateUrl: './consultar-documentos-utd-bcp.component.html',
  styleUrls: ['./consultar-documentos-utd-bcp.component.css']
})
export class ConsultarDocumentosUtdBcpComponent implements OnInit {

  constructor(public documentoService: DocumentoService, 
              private utilsService: UtilsService, 
              private notifier: NotifierService) {

  }


  documentos = [];
  
  documentosSubscription: Subscription;
  documentoForm: FormGroup;


  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl('', Validators.required),
      "fechaFin": new FormControl('', Validators.required),
      "codigo": new FormControl('', Validators.required)
    })


    console.log(this.documentoForm.controls['fechaIni'].value);

  }


  listarDocumentos() {
    
    if(this.documentoForm.controls['codigo'].value.length !== 0){
    
      this.documentosSubscription = this.documentoService.listarDocumentosUtdBCPCodigo(this.documentoForm.controls['codigo'].value)
      .subscribe(
        documento => {
          this.documentos = []
          this.documentos.push(documento);
          this.documentoForm.controls['codigo'].reset();
          this.documentoForm.controls['fechaIni'].reset();
          this.documentoForm.controls['fechaFin'].reset();
          this.documentoForm.controls['fechaIni'].enable();
          this.documentoForm.controls['fechaFin'].enable();
          this.notifier.notify('success', 'CÓDIGO AUTOGENERADO ENCONTRADO');
        },
        error =>{
          if(error.status === 400){
            this.documentos = [];
            this.notifier.notify('error', 'NO EXISTE DOCUMENTO CON ESE AUTOGENERADO');
          }
        }
      ); 
    }
    
    else if(!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)){

      this.documentosSubscription = this.documentoService.listarDocumentosUtdBCPFechas(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value)
      .subscribe(
        documentos => {
          this.documentos = documentos
          this.documentoForm.controls['codigo'].enable();
        },
        error =>{
          if(error.status === 400){
            this.documentos = [];
            this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
          }
        }
      );
    }

    else{
      this.notifier.notify('error', 'COMPLETE AMBAS FECHAS');
    }
  }


  

  desactivarFechas(codigo) {
    console.log(codigo);
    if (codigo.length === 0) {
      this.documentoForm.controls['fechaIni'].enable();
      this.documentoForm.controls['fechaFin'].enable();
    }else{
      this.documentoForm.controls['fechaIni'].disable();
      this.documentoForm.controls['fechaFin'].disable();
    }
  }


  desactivarCodigo(fechaIni, fechaFin) {
    if (this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) && this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)){
      this.documentoForm.controls['codigo'].enable();
    }else{
      this.documentoForm.controls['codigo'].disable();
    }
  }



  ngOnDestroy() {
    this.documentosSubscription.unsubscribe();
  }

}
