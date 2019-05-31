import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionarDevueltosComponent } from './recepcionar-devueltos.component';
import { TableManagementModule } from '../table-management/table-management.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { AsignarCodigoDevolucionComponent } from './asignar-codigo/asignar-codigo.component';

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
    RecepcionarDevueltosComponent,
    AsignarCodigoDevolucionComponent
  ],
  entryComponents: [
    ButtonViewComponent,
    AsignarCodigoDevolucionComponent
  ]
})
export class RecepcionarDevueltosModule { }
