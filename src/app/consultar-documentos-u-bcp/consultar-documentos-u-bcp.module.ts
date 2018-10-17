import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDocumentosUBCPComponent } from './consultar-documentos-u-bcp.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConsultarDocumentosUBCPComponent
  ]
})
export class ConsultarDocumentosUBCPModule { }
