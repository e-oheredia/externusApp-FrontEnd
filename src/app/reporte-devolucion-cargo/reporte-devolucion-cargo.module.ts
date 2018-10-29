import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteDevolucionCargoComponent } from './reporte-devolucion-cargo.component';
import { SharedModule} from '../shared/shared.module'

@NgModule({
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule,
      SharedModule
      
    ],
    declarations: [
        ReporteDevolucionCargoComponent
    ]
  })
  export class ReporteDevolucionCargoModule { 





  }
