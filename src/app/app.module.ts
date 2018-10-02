import { SubirResultadosEnviosModule } from './subir-resultados-envios/subir-resultados-envios.module';
import { ListarGuiasEnviadasModule } from './listar-guias-enviadas/listar-guias-enviadas.module';
import { ListarDocumentosCustodiadosModule } from './listar-documentos-custodiados/listar-documentos-custodiados.module';
import { ListarGuiasCreadasModule } from './listar-guias-creadas/listar-guias-creadas.module';
import { CustodiarEnviosMasivosModule } from './custodiar-envios-masivos/custodiar-envios-masivos.module';
import { CustodiarDocumentosIndividualesModule } from './custodiar-documentos-individuales/custodiar-documentos-individuales.module';
import { AutorizarEnviosModule } from './autorizar-envios/autorizar-envios.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NotifierModule } from "angular-notifier";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    LayoutModule, 
    AutorizarEnviosModule, 
    NotifierModule, 
    CustodiarDocumentosIndividualesModule, 
    CustodiarEnviosMasivosModule, 
    ListarGuiasCreadasModule, 
    ListarDocumentosCustodiadosModule,
    ListarGuiasEnviadasModule, 
    SubirResultadosEnviosModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
