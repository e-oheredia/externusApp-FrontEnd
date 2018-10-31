import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustodiarDocumentosIndividualesComponent } from './custodiar-documentos-individuales.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    NgxBarcodeModule
  ],
  declarations: [CustodiarDocumentosIndividualesComponent]
})
export class CustodiarDocumentosIndividualesModule { }
