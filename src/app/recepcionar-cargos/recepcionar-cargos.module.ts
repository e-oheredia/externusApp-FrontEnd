import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionarCargosComponent } from './recepcionar-cargos.component';


@NgModule({
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule
    ],
    declarations: [
      RecepcionarCargosComponent
    ]
  })


  export class RecepcionarCargosModule { }





