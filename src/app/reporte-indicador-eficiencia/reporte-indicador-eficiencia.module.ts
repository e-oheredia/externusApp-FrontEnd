import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteIndicadorEficienciaComponent } from './reporte-indicador-eficiencia.component';
import { SharedModule} from '../shared/shared.module'

@NgModule({
  imports: [
    CommonModule, 
      FormsModule,
      ReactiveFormsModule,
      SharedModule
  ],
  declarations: [ReporteIndicadorEficienciaComponent]
})
export class ReporteIndicadorEficienciaModule { }
