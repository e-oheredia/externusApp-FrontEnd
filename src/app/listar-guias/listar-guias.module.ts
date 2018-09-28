import { ListarGuiasComponent } from './listar-guias.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearGuiaModalComponent } from './crear-guia-modal/crear-guia-modal.component';
import { ValidarDocumentosGuiaModalComponent } from './validar-documentos-guia-modal/validar-documentos-guia-modal.component';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';

@NgModule({
  imports: [    
    FormsModule,
    ReactiveFormsModule,
    CommonModule    
  ],
  declarations: [
    ListarGuiasComponent,
    CrearGuiaModalComponent,
    ValidarDocumentosGuiaModalComponent
  ],
  entryComponents:[
    CrearGuiaModalComponent,
    ValidarDocumentosGuiaModalComponent
  ]
})

export class ListarGuiasModule { }
