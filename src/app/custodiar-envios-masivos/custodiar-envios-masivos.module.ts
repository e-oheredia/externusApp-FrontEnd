import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustodiarEnviosMasivosComponent } from './custodiar-envios-masivos.component';
import { CustodiarDocumentosMasivoModalComponent } from './custodiar-documentos-masivo-modal/custodiar-documentos-masivo-modal.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    NgxBarcodeModule
  ],
  declarations: [
    CustodiarEnviosMasivosComponent, 
    CustodiarDocumentosMasivoModalComponent
  ], 
  entryComponents:[
    CustodiarDocumentosMasivoModalComponent
  ]
})
export class CustodiarEnviosMasivosModule { }
