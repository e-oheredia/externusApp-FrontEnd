import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionarDocumentosComponent } from './recepcionar-documentos.component';
import { AsignarCodigoDocumentoComponent } from './asignar-codigo/asignar-codigo.component';
import { TableManagementModule } from '../table-management/table-management.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@NgModule({
    imports: [
      CommonModule,
      TableManagementModule,
      Ng2SmartTableModule,
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule      
    ],
    declarations: [
        RecepcionarDocumentosComponent,
        AsignarCodigoDocumentoComponent
    ],
    entryComponents: [
      ButtonViewComponent,
      AsignarCodigoDocumentoComponent
    ]
  })
  export class RecepcionarDocumentosModule { }
