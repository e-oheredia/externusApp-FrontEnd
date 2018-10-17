import { NgSelectModule } from '@ng-select/ng-select';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { PermisoPlazoDistribucionModule } from './permiso-plazo-distribucion/permiso-plazo-distribucion.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoComponent } from './mantenimiento.component';

@NgModule({
  imports: [
    CommonModule,     
    MantenimientoRoutingModule,  
    PermisoPlazoDistribucionModule, 
  ],
  declarations: [MantenimientoComponent]
})
export class MantenimientoModule { }
