import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDocumentosUBCPComponent } from './consultar-documentos-u-bcp.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ConsultarDocumentosUBCPComponent
  ]
})
export class ConsultarDocumentosUBCPModule { }
