import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubirResultadosEnviosComponent } from './subir-resultados-envios.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule
  ],
  declarations: [SubirResultadosEnviosComponent]
})
export class SubirResultadosEnviosModule { }
