import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenerarDocumentosComponent } from "./generar-documentos.component";
import { GenerarDocumentoIndividualComponent } from "./generar-documento-individual/generar-documento-individual.component";
import { GenerarMasivoComponent } from "./generar-masivo/generar-masivo.component";

const generarDocumentosRoutes: Routes = [
    {
        path: '', component: GenerarDocumentosComponent, children: [
            {
                path: 'individual', component: GenerarDocumentoIndividualComponent
            }, 
            {
                path: 'masivo', component: GenerarMasivoComponent
            } 
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(generarDocumentosRoutes)
    ], 
    exports: [RouterModule]
})

export class GenerarDocumentosRoutingModule{}