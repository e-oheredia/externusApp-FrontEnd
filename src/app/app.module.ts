import { ListarDocumentosCustodiadosModule } from './listar-documentos-custodiados/listar-documentos-custodiados.module';
import { ListarGuiasModule } from './listar-guias/listar-guias.module';
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
    ListarGuiasModule, 
    ListarDocumentosCustodiadosModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
