import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteAutorizacionComponent } from './reporte-autorizacion.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  declarations: [ReporteAutorizacionComponent]
})
export class ReporteAutorizacionModule { }
