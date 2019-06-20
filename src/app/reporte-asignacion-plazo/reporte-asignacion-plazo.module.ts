import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteAsignacionPlazoComponent } from './reporte-asignacion-plazo.component';
import { Ng2SmartTableModule } from '../../../node_modules/ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { TableManagementModule } from '../table-management/table-management.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    TableManagementModule,
    SharedModule
  ],
  declarations: [ReporteAsignacionPlazoComponent]
})
export class ReporteAsignacionPlazoModule { }
