import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarGuiasbloqueCreadasComponent } from './listar-guiasbloque-creadas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ModificarGuiabloqueComponent } from './modificar-guiabloque/modificar-guiabloque.component';
// import { EliminarGuiabloqueComponent } from './eliminar-guiabloque/eliminar-guiabloque.component';
// import { EnviarGuiabloqueComponent } from './enviar-guiabloque/enviar-guiabloque.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ListarGuiasbloqueCreadasComponent,
    // ModificarGuiabloqueComponent,
    // EliminarGuiabloqueComponent,
    // EnviarGuiabloqueComponent
  ]
})
export class ListarGuiasbloqueCreadasModule { }
