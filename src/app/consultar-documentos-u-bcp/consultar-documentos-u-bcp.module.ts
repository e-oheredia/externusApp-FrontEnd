import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDocumentosUBCPComponent } from './consultar-documentos-u-bcp.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
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
    ConsultarDocumentosUBCPComponent
  ],
  entryComponents: [
    ButtonViewComponent
  ]
})
export class ConsultarDocumentosUBCPModule { }
