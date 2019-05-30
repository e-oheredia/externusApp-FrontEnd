import { ListarGuiasCreadasComponent } from './listar-guias-creadas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearGuiaModalComponent } from './crear-guia-modal/crear-guia-modal.component';
import { ValidarDocumentosGuiaModalComponent } from './validar-documentos-guia-modal/validar-documentos-guia-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModificarGuiaModalComponent } from './modificar-guia-modal/modificar-guia-modal.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableManagementModule } from '../table-management/table-management.module';
@NgModule({

  imports: [
  CommonModule, 
  FormsModule,
  Ng2SmartTableModule,
  NgxBarcodeModule,
  ReactiveFormsModule,
  TableManagementModule  
  ],
  declarations: [
    ListarGuiasCreadasComponent,
    CrearGuiaModalComponent,
    ValidarDocumentosGuiaModalComponent,
    ModificarGuiaModalComponent
  ],
  entryComponents:[
    CrearGuiaModalComponent,
    ValidarDocumentosGuiaModalComponent, 
    ModificarGuiaModalComponent
  ]
})

export class ListarGuiasCreadasModule { }
