import { NgxBarcodeModule } from 'ngx-barcode';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { GenerarDocumentoIndividualComponent } from './generar-documento-individual/generar-documento-individual.component';
import { GenerarMasivoComponent } from './generar-masivo/generar-masivo.component';
import { GenerarDocumentosRoutingModule } from './generar-documentos-routing.module';
import { GenerarDocumentosComponent } from './generar-documentos.component';
import { DatosBuzonComponent } from './datos-buzon/datos-buzon.component';
import { GenerarBloqueComponent } from './generar-bloque/generar-bloque.component';

@NgModule({
  imports: [
    CommonModule, 
    GenerarDocumentosRoutingModule, 
    ReactiveFormsModule, 
    FormsModule, 
    Ng2SmartTableModule,
    NgxBarcodeModule
    
  ],
  declarations: [
    GenerarDocumentosComponent,
    GenerarDocumentoIndividualComponent, 
    GenerarMasivoComponent, 
    DatosBuzonComponent, 
    GenerarBloqueComponent
  ], 
  entryComponents: [
  ]
})
export class GenerarDocumentosModule { }
