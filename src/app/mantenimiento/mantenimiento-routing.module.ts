import { PermisoPlazoDistribucionComponent } from './permiso-plazo-distribucion/permiso-plazo-distribucion.component';
import { MantenimientoComponent } from './mantenimiento.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const mantenimientoRoutes: Routes = [
    {
        path: '', component: MantenimientoComponent, children: [
            {
                path: 'permiso-plazo-distribucion', component: PermisoPlazoDistribucionComponent
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