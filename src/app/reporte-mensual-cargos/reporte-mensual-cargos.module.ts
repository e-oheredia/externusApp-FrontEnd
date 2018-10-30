import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReporteMensualCargosComponent } from './reporte-mensual-cargos.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        ReporteMensualCargosComponent
      ]
})

export class ReporteMensualCargosModule {}