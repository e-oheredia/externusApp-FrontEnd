import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteGuiasComponent } from './reporte-guias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';

@NgModule({
  imports: [
    Ng2SmartTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableManagementModule,
    SharedModule
  ],
  declarations: [
    ReporteGuiasComponent
  ]
})
export class ReporteGuiasModule { }
