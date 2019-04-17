import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionarBloqueComponent } from './recepcionar-bloque.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableManagementModule } from '../table-management/table-management.module';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    TableManagementModule
  ],
  declarations: [RecepcionarBloqueComponent],
  entryComponents: [ButtonViewComponent]
})
export class RecepcionarBloqueModule { }
