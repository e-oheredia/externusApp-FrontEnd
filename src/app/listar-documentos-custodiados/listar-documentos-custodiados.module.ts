import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ListarDocumentosCustodiadosComponent } from './listar-documentos-custodiados.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ],
  declarations: [
    ListarDocumentosCustodiadosComponent
  ]
})
export class ListarDocumentosCustodiadosModule { }
