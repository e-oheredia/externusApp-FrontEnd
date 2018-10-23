import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteMensualVolumenComponent} from './reporte-mensual-volumen.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ReporteMensualVolumenComponent
      ]
})

export class ReporteMensualVolumenModule {}