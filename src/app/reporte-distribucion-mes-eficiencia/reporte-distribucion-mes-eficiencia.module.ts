import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteEficienciaComponent } from './reporte-distribucion-mes-eficiencia.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ReporteEficienciaComponent
  ]
})
export class ReporteDistribucionMesEficienciaModule { }
