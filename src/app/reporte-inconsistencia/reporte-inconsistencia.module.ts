import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteInconsistenciaComponent } from './reporte-inconsistencia.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableManagementModule } from '../table-management/table-management.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    Ng2SmartTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableManagementModule,
    SharedModule
  ],
  declarations: [ReporteInconsistenciaComponent]
})
export class ReporteInconsistenciaModule { }
