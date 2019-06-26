import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoComponent } from './mantenimiento.component';
import { TableManagementModule } from '../table-management/table-management.module';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { PlazoDistribucionComponent } from './plazo-distribucion/plazo-distribucion.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { PermisoPlazoDistribucionComponent } from './permiso-plazo-distribucion/permiso-plazo-distribucion.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TipoSeguridadComponent } from './tipo-seguridad/tipo-seguridad.component';
import { TipoServicioComponent } from './tipo-servicio/tipo-servicio.component';
import { ProductoComponent } from './producto/producto.component';
import { AmbitoComponent } from './ambito/ambito.component';
import { ClasificacionComponent } from './clasificacion/clasificacion.component';
import { DiaLaborableComponent } from './dias-laborables/dias-laborables.component';

@NgModule({
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    TableManagementModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [
    MantenimientoComponent,
    PlazoDistribucionComponent,
    ProveedorComponent,
    PermisoPlazoDistribucionComponent,
    TipoSeguridadComponent,
    TipoServicioComponent,
    ProductoComponent,
    AmbitoComponent,
    ClasificacionComponent,
    DiaLaborableComponent
  ],
  entryComponents: [
    ButtonViewComponent,
  ]
})
export class MantenimientoModule { }
