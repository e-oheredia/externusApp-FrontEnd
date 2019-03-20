import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableManagementModule } from '../table-management/table-management.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecepcionarCargosComponent } from './recepcionar-cargos.component';
import { AsignarCodigoCargoComponent } from './asignar-codigo/asignar-codigo.component';
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
    RecepcionarCargosComponent,
    AsignarCodigoCargoComponent
  ],
  entryComponents: [
    ButtonViewComponent,
    AsignarCodigoCargoComponent
  ]
})
export class RecepcionarCargosModule { }
