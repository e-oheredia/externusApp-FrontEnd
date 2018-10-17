import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDocumentosUtdBcpComponent } from './consultar-documentos-utd-bcp.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConsultarDocumentosUtdBcpComponent
  ]
})
export class ConsultarDocumentosUtdBcpModule { }
