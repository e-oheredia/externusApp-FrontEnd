import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteIndicadorEfectividadComponent } from './reporte-indicador-efectividad.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule, 
    FormsModule, 
    ReactiveFormsModule,
    OrderModule 
  ],
  declarations: [ReporteIndicadorEfectividadComponent]
})
export class ReporteIndicadorEfectividadModule { }
