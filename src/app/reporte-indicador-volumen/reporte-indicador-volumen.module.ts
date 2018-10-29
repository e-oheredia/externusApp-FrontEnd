import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteIndicadorVolumenComponent } from './reporte-indicador-volumen.component';
import { SharedModule} from '../shared/shared.module'

@NgModule({
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule,
      SharedModule
      
    ],
    declarations: [
        ReporteIndicadorVolumenComponent
    ]
  })
  export class ReporteIndicadorVolumenModule { 





  }
