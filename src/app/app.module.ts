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
import { ConsultarDocumentosUBCPModule } from './consultar-documentos-u-bcp/consultar-documentos-u-bcp.module';
import { RecepcionarDocumentosModule } from './recepcionar-documentos/recepcionar-documentos.module';
import { ConsultarDocumentosUtdBcpModule } from './consultar-documentos-utd-bcp/consultar-documentos-utd-bcp.module';

import { ReporteEficaciaModule } from './reporte-eficacia/reporte-eficacia.module';


import { ReporteDevolucionCargoModule } from './reporte-devolucion-cargo/reporte-devolucion-cargo.module';
import { ReporteIndicadorVolumenModule } from './reporte-indicador-volumen/reporte-indicador-volumen.module';

import { ReporteMensualVolumenModule } from './reporte-mensual-volumen/reporte-mensual-volumen.module';
import { ReporteMensualCargosModule } from './reporte-mensual-cargos/reporte-mensual-cargos.module';
import { ReporteDistribucionMesEficienciaModule } from './reporte-distribucion-mes-eficiencia/reporte-distribucion-mes-eficiencia.module';
import { ReporteIndicadorEfectividadModule } from './reporte-indicador-efectividad/reporte-indicador-efectividad.module';
import { ReporteIndicadorEficienciaModule } from './reporte-indicador-eficiencia/reporte-indicador-eficiencia.module';
import { CambiarEstadoModule } from './cambiar-estado/cambiar-estado.module';
import { RecepcionarCargosModule } from './recepcionar-cargos/recepcionar-cargos.module';
import { ReporteGuiasModule } from './reporte-guias/reporte-guias.module';
import { ProcesarGuiasModule } from './procesar-guias/procesar-guias.module';



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
    SubirResultadosEnviosModule,
    ConsultarDocumentosUBCPModule,
    ConsultarDocumentosUtdBcpModule,
    ReporteEficaciaModule,
    ReporteDevolucionCargoModule,
    ReporteIndicadorVolumenModule,
    ReporteMensualVolumenModule,
    ReporteMensualCargosModule,
    ReporteDistribucionMesEficienciaModule,
    ReporteIndicadorEfectividadModule,
    ReporteIndicadorEficienciaModule,
    CambiarEstadoModule,
    RecepcionarCargosModule,
    RecepcionarDocumentosModule,
    ReporteGuiasModule,
    ProcesarGuiasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
