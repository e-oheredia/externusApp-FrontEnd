import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustodiarEnviosMasivosComponent } from './custodiar-envios-masivos.component';
import { CustodiarDocumentosMasivoModalComponent } from './custodiar-documentos-masivo-modal/custodiar-documentos-masivo-modal.component';
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
    CustodiarEnviosMasivosComponent, 
    CustodiarDocumentosMasivoModalComponent
  ], 
  entryComponents:[
    CustodiarDocumentosMasivoModalComponent
  ]
})
export class CustodiarEnviosMasivosModule { }
