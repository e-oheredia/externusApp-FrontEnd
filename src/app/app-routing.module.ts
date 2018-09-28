import { ListarGuiasComponent } from './listar-guias/listar-guias.component';
import { CustodiarEnviosMasivosComponent } from './custodiar-envios-masivos/custodiar-envios-masivos.component';
import { CustodiarDocumentosIndividualesComponent } from './custodiar-documentos-individuales/custodiar-documentos-individuales.component';
import { AutorizarEnviosComponent } from './autorizar-envios/autorizar-envios.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ListarDocumentosCustodiadosComponent } from './listar-documentos-custodiados/listar-documentos-custodiados.component';

const appRoutes: Routes = [
    {
        path: 'generar-documentos', 
        loadChildren: './generar-documentos/generar-documentos.module#GenerarDocumentosModule'
    },
    {
        path: 'autorizar-envios',
        component: AutorizarEnviosComponent
    }, 
    {
        path: 'custodiar-envios-individuales',
        component: CustodiarDocumentosIndividualesComponent
    }, 
    {
        path: 'custodiar-envios-masivos',
        component: CustodiarEnviosMasivosComponent
    }, 
    {
        path: 'guias',
        component: ListarGuiasComponent
    }, 
    {
        path: 'documentos-custodiados',
        component: ListarDocumentosCustodiadosComponent
    }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)], 
    exports: [RouterModule]
})
export class AppRoutingModule{}