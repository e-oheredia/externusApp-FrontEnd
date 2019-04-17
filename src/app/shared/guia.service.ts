import { DocumentoService } from './documento.service';
import { SeguimientoGuia } from './../../model/seguimientoguia.model';
import { WriteExcelService } from './write-excel.service';
import { DocumentoGuia } from '../../model/documentoguia.model';
import { Guia } from '../../model/guia.model';
import * as moment from 'moment-timezone';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";
import { Sede } from 'src/model/sede.model';
import { HttpParams } from '@angular/common/http';
import { EstadoGuia } from 'src/model/estadoguia.model';

@Injectable()
export class GuiaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.GUIA_URL;

    constructor(
        private requester: RequesterService, 
        private writeExcelService: WriteExcelService,
        private documentoService: DocumentoService
    ) {

    }

    listarGuiasCreadas(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "creados", {});
    }

    listarGuiasBloqueCreadas(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "creadosbloque", {});
    }

    listarGuiaPorCodigo(codigo: string): Observable<Guia>{
        return this.requester.get<Guia>(this.REQUEST_URL + "reporteguias" , { params: new HttpParams().append('numeroGuia', codigo.toString())});
    }

    listarGuiasPorFechas(fechaini: Date, fechafin: Date){
        return this.requester.get<Guia[]>(this.REQUEST_URL + "reporteguias" , { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    listarDocumentosGuiaValidados(guia: Guia): DocumentoGuia[] {
        return guia.documentosGuia.filter(documentoGuia => documentoGuia.validado === true);
    }

    retirarNoValidados(guia: Guia) {
        return this.requester.put<any>(this.REQUEST_URL + guia.id + "/retiro", null, {});
    }
    
    getCantidadDocumentosPorGuia(guia: Guia){
        return this.requester.get<any>(this.REQUEST_URL + guia.id + "/documentos" + null, {});
    }
    
    registrarGuia(guia: Guia): Observable<Guia> {
        return this.requester.post<Guia>(this.REQUEST_URL, guia, {});
    }

    enviarGuia(guiaId: number){
        return this.requester.put<Guia>(this.REQUEST_URL + guiaId.toString() + "/envio", null, {});
    }

    modificarGuia(guia: Guia){
        return this.requester.put<Guia>(this.REQUEST_URL + guia.id.toString(), guia, {});
    }

    eliminarGuia(guiaId: number){
        return this.requester.delete<Guia>(this.REQUEST_URL + guiaId.toString(), {});
    }

    listarGuiasPorProcesar(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "procesarguias", {});
    }

    listarGuiasSinCerrar() : Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "sincerrar", {});
    }

    listarDocumentosGuiaByUltimoEstadoAndGuia(guia: Guia, estadoId: number): DocumentoGuia[] {
        return guia.documentosGuia.filter(
            documentoGuia => this.documentoService.getUltimoEstado(documentoGuia.documento).id === estadoId
        );
    }

    fechaLimiteReparto(guia: Guia): Date{
        let a = guia.plazoDistribucion.tiempoEnvio
        let fechaInicial = this.getSeguimientoGuiaByEstadoGuiaId(guia,2).fecha                
        return fechaInicial
        //FALTA DEFINIR COMO SE MANEJARÁ LA FECHA LÍMITE
    }

    getFechaCreacion(guia: Guia): Date{
        return guia.seguimientosGuia.find(seguimientoDocumento => 
            seguimientoDocumento.estadoGuia.id === 1
        ).fecha;
    }

    getFechaEnvio(guia: Guia): Date{
        let seguimientoDocumento =  guia.seguimientosGuia.find(seguimientoDocumento => 
            seguimientoDocumento.estadoGuia.id === 2
        );

        if (seguimientoDocumento == null) {
            return null;
        }
        return seguimientoDocumento.fecha;
    }

    getEstadoGuia(guia: Guia): EstadoGuia{
        let estadoGuia = guia.seguimientosGuia.reduce(
            (max, seguimientosGuia) =>
                moment(seguimientosGuia.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientosGuia : max, guia.seguimientosGuia[0]
        ).estadoGuia;

        return estadoGuia;
    }

    getFechaUltimoEstadoGuia(guia: Guia): Date | string {
        return guia.seguimientosGuia.reduce(
            (max, seguimientosGuia) =>
            moment(seguimientosGuia.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimientosGuia : max, guia.seguimientosGuia[0]
        ).fecha
    }

    getSeguimientoGuiaByEstadoGuiaId(guia: Guia, estadoGuiaId: number): SeguimientoGuia{
        return guia.seguimientosGuia.find(seguimientoDocumento => 
            seguimientoDocumento.estadoGuia.id === estadoGuiaId
        ) 
    }

    asignarFechaDescarga(guia: Guia){
        return this.requester.put<any>(this.REQUEST_URL + guia.id.toString() + "/descarga", null, {});
    }

    //DESCARGAR BASE
    exportarDocumentosGuia(guia: Guia) {

        let objects = [];
        guia.documentosGuia.forEach(documentoGuia => {
            objects.push({
                "Guía": guia.numeroGuia, 
                "Autogenerado": documentoGuia.documento.documentoAutogenerado,
                "Guía + Autogenerado": guia.numeroGuia + documentoGuia.documento.documentoAutogenerado,
                "Sede Remitente": guia.sede.nombre,
                "Plazo de Distribución": documentoGuia.documento.envio.plazoDistribucion.nombre,
                "Tipo de Seguridad": documentoGuia.documento.envio.tipoSeguridad.nombre,
                "Tipo de Servicio": documentoGuia.documento.envio.tipoServicio.nombre,
                "Clasificación": documentoGuia.documento.envio.clasificacion.nombre,
                "Producto": documentoGuia.documento.envio.producto ? documentoGuia.documento.envio.producto.nombre : 'NO TIENE',
                "Razón Social": documentoGuia.documento.razonSocialDestino,
                "Contacto": documentoGuia.documento.contactoDestino,
                "Departamento": documentoGuia.documento.distrito.provincia.departamento.nombre,
                "Provincia": documentoGuia.documento.distrito.provincia.nombre,
                "Distrito": documentoGuia.documento.distrito.nombre,
                "Direccion": documentoGuia.documento.direccion,
                "Referencia": documentoGuia.documento.referencia,
                "Teléfono": documentoGuia.documento.telefono
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Guia: " + guia.numeroGuia);
    }

}