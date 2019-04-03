import { PermisoPlazoDistribucionComponent } from './permiso-plazo-distribucion/permiso-plazo-distribucion.component';
import { MantenimientoComponent } from './mantenimiento.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlazoDistribucionComponent } from './plazo-distribucion/plazo-distribucion.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { TipoSeguridadComponent } from './tipo-seguridad/tipo-seguridad.component';
import { TipoServicioComponent } from './tipo-servicio/tipo-servicio.component';
import { ProductoComponent } from './producto/producto.component';

const mantenimientoRoutes: Routes = [
    {
        path: '', component: MantenimientoComponent, children: [
            {
                path: 'permiso-plazo-distribucion', component: PermisoPlazoDistribucionComponent
            },
            {
                path: 'plazo-distribucion', component: PlazoDistribucionComponent
            },
            {
                path: 'proveedor', component: ProveedorComponent
            },
            {
                path: 'tipo-seguridad', component: TipoSeguridadComponent
            },
            {
                path: 'tipo-servicio', component: TipoServicioComponent
            },
            {
                path: 'producto', component: ProductoComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(mantenimientoRoutes)
    ], 
    exports: [RouterModule]
})

export class MantenimientoRoutingModule{}