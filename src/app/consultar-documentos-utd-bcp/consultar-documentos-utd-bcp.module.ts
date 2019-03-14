import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDocumentosUtdBcpComponent } from './consultar-documentos-utd-bcp.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TableManagementModule } from '../table-management/table-management.module';

@NgModule({
  imports: [
    Ng2SmartTableModule,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    TableManagementModule
  ],
  declarations: [
    ConsultarDocumentosUtdBcpComponent
  ],
  entryComponents: [
    ButtonViewComponent
  ]
})
export class ConsultarDocumentosUtdBcpModule { }
