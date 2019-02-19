import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { EnvioService } from '../shared/envio.service';

@Component({
  selector: 'app-consultar-documentos-utd-bcp',
  templateUrl: './consultar-documentos-utd-bcp.component.html',
  styleUrls: ['./consultar-documentos-utd-bcp.component.css']
})
export class ConsultarDocumentosUtdBcpComponent implements OnInit {

  constructor(public documentoService: DocumentoService, 
              private utilsService: UtilsService, 
              private notifier: NotifierService,
              public envioService: EnvioService) {

  }


  documentos = [];
  
  documentosSubscription: Subscription;
  documentoForm: FormGroup;


  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD') , Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "codigo": new FormControl('', Validators.required)
    })

    this.listarDocumentos();

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
            this.notifier.notify('error', 'NO HAY RESULTADOS');
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
            this.notifier.notify('error', 'RANGO DE FECHA NO VÁLIDA');
          }
        }
      );
    }

    else{
      this.notifier.notify('error', 'INGRESE ALGÚN DATO DE CONSULTA');
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
    console.log(fechaIni);
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
