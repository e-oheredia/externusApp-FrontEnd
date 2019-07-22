import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarGuiasbloqueCreadasComponent } from './listar-guiasbloque-creadas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ListarGuiasbloqueCreadasComponent
  ]
})
export class ListarGuiasbloqueCreadasModule { }
