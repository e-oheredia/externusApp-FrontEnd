import { AppSettings } from './app.settings';
import { Envio } from '../../model/envio.model';
import { Injectable, ModuleWithComponentFactories } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from 'rxjs';
import { Documento } from '../../model/documento.model';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { DocumentoService } from './documento.service';
import { HttpParams } from '@angular/common/http';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { EstadoAutorizacion } from 'src/model/estadoautorizacion.model';
import * as moment from 'moment-timezone';
import { SeguimientoAutorizacion } from 'src/model/seguimientoautorizacion.model';
import { WriteExcelService } from './write-excel.service';
import { UtilsService } from './utils.service';
import { EnvioMasivo } from 'src/model/enviomasivo.model';
import { Inconsistencia } from 'src/model/inconsistencia.model';


@Injectable()
export class EnvioService {

    constructor(private requester: RequesterService,
                private documentoService: DocumentoService,
                private writeExcelService: WriteExcelService,
                private utilsService: UtilsService
                ) { }

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ENVIO_URL;

    registrarEnvio(envio: Envio, file: File, codigoGuia: number, proveedor: number): Observable<Envio> {
        let form: FormData = new FormData;
        form.append("envio", JSON.stringify(envio));
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<Envio>(this.REQUEST_URL, form, {});
    }

    getAutorizacion(documento: Documento): string {
        let autorizacion = " ";

        if (this.documentoService.getUltimoSeguimientoDocumento(documento).estadoDocumento.id === EstadoDocumentoEnum.DENEGADO){
            autorizacion = "DENEGADO";
        } else if(documento.envio.autorizado === false){
            autorizacion = "PENDIENTE";
        } else {
            autorizacion = "APROBADO";
        }
        return autorizacion;
    }

    getUltimoSeguimientoAutorizacion(envio: Envio): SeguimientoAutorizacion {
        return envio.seguimientosAutorizado.reduce(
            (max, seguimentoAutorizado) =>
                moment(seguimentoAutorizado.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoAutorizado : max, envio.seguimientosAutorizado[0]
        );

        
    }

    getUltimaFechaEstadoAutorizacion(envio: Envio): Date | string {
        return envio.seguimientosAutorizado.reduce(
            (max, seguimientoAutorizacion) =>
                moment(seguimientoAutorizacion.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientoAutorizacion : max, envio.seguimientosAutorizado[0]
        ).fecha
    }

    getAutorizador(envio: Envio) {
        return envio.seguimientosAutorizado.reduce(
            (max, seguimientoAutorizado) =>
                moment(seguimientoAutorizado.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientoAutorizado : max, envio.seguimientosAutorizado[0]
        ).nombreUsuario
    }
    
    getAutogeneradoEnvio(envio: any){
        let auto;
        if (!this.utilsService.isUndefinedOrNullOrEmpty(envio.masivoAutogenerado)){
            auto = envio.masivoAutogenerado;
        } else {
            auto = envio.documentos[0].documentoAutogenerado
        }
        
        return auto;
    }

    listarEnviosIndividualesCreados() {
        return this.requester.get<Envio[]>(this.REQUEST_URL + "creados", {});
    }

    listarEnviosNoAutorizados(): Observable<Envio[]> {
        return this.requester.get<Envio[]>(this.REQUEST_URL + "noautorizados", {});
    }

    listarEnviosParaAutorizarPorFechas(fechaini: Date, fechafin: Date){
        return this.requester.get<Envio[]>(this.REQUEST_URL + "enviosautorizacion" , { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    modificarEnvio(envio: Envio, plazoDistribucion: PlazoDistribucion): Observable<Envio>{
        return this.requester.put<Envio>(this.REQUEST_URL + envio.id.toString() + "/modificautorizacion", plazoDistribucion, {});
    }

    autorizarEnvio(id: number): Observable<Envio> {
        return this.requester.put<Envio>(this.REQUEST_URL + id.toString() + "/autorizacion", {}, {});
    }

    denegarEnvio(id: number): Observable<Envio> {
        return this.requester.put<Envio>(this.REQUEST_URL + id.toString() + "/denegacion", {}, {});
    }

    exportarAutorizaciones(envios){
        let objects = [];
        envios.forEach(envio => {
            objects.push({
                "Área" : envio.buzon.area.nombre,
                "Usuario" : envio.buzon.nombre,
                "Autogenerado" : this.getAutogeneradoEnvio(envio),
                "Producto" : envio.producto.nombre,
                "Plazo Distribución" : envio.plazoDistribucion.nombre,
                "Cantidad Documentos" : envio.documentos.length,
                "Autorización" : this.getUltimoSeguimientoAutorizacion(envio).estadoAutorizado.nombre,
                "Usuario Autorizador" : this.getAutorizador(envio),
                "Fecha Autorización" : this.getUltimaFechaEstadoAutorizacion(envio)
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Buzón: ");
    
    }

    listarEnviosConInconsistenciasPorFechas(fechaini: Date, fechafin: Date): Observable<Envio[]> {
        return this.requester.get<Envio[]>(this.REQUEST_URL + "enviosinconsistencias", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString())});
    }

    descargarInconsistenciasEnvio(inconsistencias, envio){
        let objects = [];
        inconsistencias.forEach(inconsistencia => {
            objects.push({
                "Número de envío" : envio.id,
                "Número de documento" : inconsistencia.numeroDocumento,
                "Razón social" : inconsistencia.razonSocial,
                "Contacto" : inconsistencia.contacto,
                "Departamento" : inconsistencia.departamento,
                "Provincia" : inconsistencia.provincia,
                "Distrito" : inconsistencia.distrito,
                "Teléfono" : inconsistencia.telefono,
                "Dirección" : inconsistencia.direccion,
                "Referencia" : inconsistencia.referencia,
                "Resumen de inconsistencias": inconsistencia.resumen
            })
        })
        this.writeExcelService.jsonToExcel(objects, "Inconsistencias ");
    }

    listarEnviosConInconsistenciasPorEnvioId(id: number): Observable<Inconsistencia[]> {
        return this.requester.get<Inconsistencia[]>(this.REQUEST_URL + id.toString() + "/inconsistencia", {});
    }

}
