import { ReporteEficienciaComponent } from './reporte-distribucion-mes-eficiencia/reporte-distribucion-mes-eficiencia.component';
import { ListarGuiasCreadasComponent } from './listar-guias-creadas/listar-guias-creadas.component';
import { CustodiarEnviosMasivosComponent } from './custodiar-envios-masivos/custodiar-envios-masivos.component';
import { CustodiarDocumentosIndividualesComponent } from './custodiar-documentos-individuales/custodiar-documentos-individuales.component';
import { AutorizarEnviosComponent } from './autorizar-envios/autorizar-envios.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ListarDocumentosCustodiadosComponent } from './listar-documentos-custodiados/listar-documentos-custodiados.component';
import { ConsultarDocumentosUBCPComponent } from './consultar-documentos-u-bcp/consultar-documentos-u-bcp.component';
import { ConsultarDocumentosUtdBcpComponent } from './consultar-documentos-utd-bcp/consultar-documentos-utd-bcp.component';
import { ReporteDevolucionCargoComponent } from './reporte-devolucion-cargo/reporte-devolucion-cargo.component';
import { ReporteIndicadorVolumenComponent } from './reporte-indicador-volumen/reporte-indicador-volumen.component';
import { ReporteMensualVolumenComponent } from './reporte-mensual-volumen/reporte-mensual-volumen.component';
import {  ReporteEficaciaComponent } from './reporte-eficacia/reporte-eficacia.component';
import { ReporteMensualCargosComponent } from './reporte-mensual-cargos/reporte-mensual-cargos.component';
import { ReporteIndicadorEficaciaComponent } from './reporte-indicador-efectividad/reporte-indicador-efectividad.component';
import { ReporteIndicadorEficienciaComponent } from './reporte-indicador-eficiencia/reporte-indicador-eficiencia.component';
import { CambiarEstadoComponent } from './cambiar-estado/cambiar-estado.component';
import { ReporteGuiasComponent } from './reporte-guias/reporte-guias.component';
import { ProcesarGuiasComponent } from './procesar-guias/procesar-guias.component';
import { ListarGuiasbloqueCreadasComponent } from './listar-guiasbloque-creadas/listar-guiasbloque-creadas.component';
import { RecepcionarBloqueComponent } from './recepcionar-bloque/recepcionar-bloque.component';
import { ReporteAutorizacionComponent } from './reporte-autorizacion/reporte-autorizacion.component';
import { ReporteInconsistenciaComponent } from './reporte-inconsistencia/reporte-inconsistencia.component';
import { RecepcionarDevueltosComponent } from './recepcionar-devueltos/recepcionar-devueltos.component';
import { ReporteAsignacionPlazoComponent } from './reporte-asignacion-plazo/reporte-asignacion-plazo.component';
import { ReporteGuiasBloqueComponent } from './reporte-guias-bloque/reporte-guias-bloque.component';



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
        path: 'guiasbloque-creadas',
        component: ListarGuiasbloqueCreadasComponent
    },
    {
        path: 'documentos-custodiados',
        component: ListarDocumentosCustodiadosComponent
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
        path: 'reporte-devolucion-cargo',
        component: ReporteDevolucionCargoComponent
    },
    {
        path: 'reporte-indicador-volumen',
        component: ReporteIndicadorVolumenComponent
    },
    {
        path: 'reporte-volumen',
        component: ReporteMensualVolumenComponent
    },
    {
        path: 'reporte-eficacia',
        component: ReporteEficaciaComponent
    },
    {    
        path: 'reporte-cargos',
        component: ReporteMensualCargosComponent
    },
    {
        path: 'reporte-eficiencia',
        component: ReporteEficienciaComponent
    },
    {
        path: 'reporte-indicador-eficacia',
        component: ReporteIndicadorEficaciaComponent
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
    },
    {
        path: 'procesar-guias',
        component: ProcesarGuiasComponent
    },
    {
        path: 'recepcionar-bloques',
        component: RecepcionarBloqueComponent
    },
    {
        path: 'reporte-autorizacion',
        component: ReporteAutorizacionComponent
    },
    {
        path: 'reporte-inconsistencia',
        component: ReporteInconsistenciaComponent
    },
    {
        path: 'recepcionar-devueltos',
        component: RecepcionarDevueltosComponent
    },
    {
        path: 'reporte-asignacion-plazos',
        component: ReporteAsignacionPlazoComponent
    },
    {
        path: 'reporte-guias-bloque',
        component: ReporteGuiasBloqueComponent
    }

]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }