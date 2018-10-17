import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubirResultadosEnviosComponent } from './subir-resultados-envios.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [SubirResultadosEnviosComponent]
})
export class SubirResultadosEnviosModule { }
