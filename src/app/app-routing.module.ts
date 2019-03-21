import { ReporteDistribucionMesEficienciaComponent } from './reporte-distribucion-mes-eficiencia/reporte-distribucion-mes-eficiencia.component';
import { ListarGuiasEnviadasComponent } from './listar-guias-enviadas/listar-guias-enviadas.component';
import { ListarGuiasCreadasComponent } from './listar-guias-creadas/listar-guias-creadas.component';
import { CustodiarEnviosMasivosComponent } from './custodiar-envios-masivos/custodiar-envios-masivos.component';
import { CustodiarDocumentosIndividualesComponent } from './custodiar-documentos-individuales/custodiar-documentos-individuales.component';
import { AutorizarEnviosComponent } from './autorizar-envios/autorizar-envios.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ListarDocumentosCustodiadosComponent } from './listar-documentos-custodiados/listar-documentos-custodiados.component';
import { SubirResultadosEnviosComponent } from './subir-resultados-envios/subir-resultados-envios.component';
import { ConsultarDocumentosUBCPComponent } from './consultar-documentos-u-bcp/consultar-documentos-u-bcp.component';
import { RecepcionarCargosComponent } from './recepcionar-cargos/recepcionar-cargos.component';
import { RecepcionarDocumentosComponent } from './recepcionar-documentos/recepcionar-documentos.component';
import { ConsultarDocumentosUtdBcpComponent } from './consultar-documentos-utd-bcp/consultar-documentos-utd-bcp.component';
import { ReporteDevolucionCargoComponent } from './reporte-devolucion-cargo/reporte-devolucion-cargo.component';
import { ReporteIndicadorVolumenComponent } from './reporte-indicador-volumen/reporte-indicador-volumen.component';
import { ReporteMensualVolumenComponent } from './reporte-mensual-volumen/reporte-mensual-volumen.component';
import {  ReporteEficaciaComponent } from './reporte-eficacia/reporte-eficacia.component';
import { ReporteMensualCargosComponent } from './reporte-mensual-cargos/reporte-mensual-cargos.component';
import { ReporteIndicadorEfectividadComponent } from './reporte-indicador-efectividad/reporte-indicador-efectividad.component';
import { ReporteIndicadorEficienciaComponent } from './reporte-indicador-eficiencia/reporte-indicador-eficiencia.component';
import { CambiarEstadoComponent } from './cambiar-estado/cambiar-estado.component';
import { ReporteGuiasComponent } from './reporte-guias/reporte-guias.component';



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
        path: 'guias-creadas',
        component: ListarGuiasCreadasComponent
    },
    {
        path: 'documentos-custodiados',
        component: ListarDocumentosCustodiadosComponent
    },
    {
        path: 'guias-enviadas',
        component: ListarGuiasEnviadasComponent
    },
    {
        path: 'subir-resultados',
        component: SubirResultadosEnviosComponent
    },
    {
        path: 'mantenimiento',
        loadChildren: './mantenimiento/mantenimiento.module#MantenimientoModule'
    },
    {
        path: 'consultar-documentos-usuario-bcp',
        component: ConsultarDocumentosUBCPComponent
    },
    {
        path: 'consultar-documentos-utd-bcp',
        component: ConsultarDocumentosUtdBcpComponent
    },
    {
        path: 'recepcionar-cargos',
        component: RecepcionarCargosComponent
    },
    {
        path: 'recepcionar-documentos',
        component: RecepcionarDocumentosComponent
    },
    {
        path: 'reporte-devolucion-cargo',
        component: ReporteDevolucionCargoComponent
    },
    {
        path: 'reporte-indicador-volumen',
        component: ReporteIndicadorVolumenComponent
    },
    {
        path: 'reportes-volumen',
        component: ReporteMensualVolumenComponent
    },
    {
        path: 'reportes-eficacia',
        component: ReporteEficaciaComponent
    },
    {    
        path: 'reportes-cargos',
        component: ReporteMensualCargosComponent
    },
    {
        path: 'reportes-distribucion-mes-eficiencia',
        component: ReporteDistribucionMesEficienciaComponent
    },
    {
        path: 'reportes-indicador-efectividad',
        component: ReporteIndicadorEfectividadComponent
    },
    {
        path: 'reporte-indicador-eficiencia',
        component: ReporteIndicadorEficienciaComponent

    },
    {
        path: 'cambiar-estado',
        component: CambiarEstadoComponent

    },
    {
        path: 'reporte-guias',
        component: ReporteGuiasComponent
    }

]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }