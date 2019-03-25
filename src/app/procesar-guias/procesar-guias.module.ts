import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesarGuiasComponent } from './procesar-guias.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableManagementModule } from '../table-management/table-management.module';

@NgModule({
  imports: [
    Ng2SmartTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableManagementModule
  ],
  declarations: [ProcesarGuiasComponent]
})
export class ProcesarGuiasModule { }
