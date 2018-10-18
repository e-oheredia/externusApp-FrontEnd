import { OrderModule } from 'ngx-order-pipe';
import { ListarGuiasEnviadasComponent } from './listar-guias-enviadas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    OrderModule 
  ],
  declarations: [
    ListarGuiasEnviadasComponent
  ]
})
export class ListarGuiasEnviadasModule { }
