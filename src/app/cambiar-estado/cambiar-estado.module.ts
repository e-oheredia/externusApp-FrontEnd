import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CambiarEstadoComponent } from './cambiar-estado.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CambiarEstadoComponent
  ]
})
export class CambiarEstadoModule { }
