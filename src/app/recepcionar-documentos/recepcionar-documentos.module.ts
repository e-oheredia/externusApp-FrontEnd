import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionarDocumentosComponent } from './recepcionar-documentos.component';

@NgModule({
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule
      
      
    ],
    declarations: [
        RecepcionarDocumentosComponent
    ]
  })
  export class RecepcionarDocumentosModule { }
