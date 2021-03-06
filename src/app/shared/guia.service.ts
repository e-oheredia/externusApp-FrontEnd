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
import { HttpParams } from '@angular/common/http';
import { EstadoGuia } from 'src/model/estadoguia.model';
import { Documento } from 'src/model/documento.model';
import { UtilsService } from './utils.service';

@Injectable()
export class GuiaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.GUIA_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService,
        private documentoService: DocumentoService,
        private utilsService: UtilsService,
    ) { }

    listarGuiasRegularCreadas(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "creados", {});
    }

    listarGuiasBloqueCreadas(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "creadosbloque", {});
    }

    listarGuiaPorCodigo(codigo: string, verificador: number, tipoguia: number): Observable<Guia> {
        return this.requester.get<Guia>(this.REQUEST_URL + tipoguia + "/reporteguias", { params: new HttpParams().append('numeroGuia', codigo.toString()).append('verificador', verificador.toString()) });
    }

    listarGuiasPorFechas(fechaini: Date, fechafin: Date, verificador: number, tipoguia: number) {
        return this.requester.get<Guia[]>(this.REQUEST_URL + tipoguia + "/reporteguias", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('verificador', verificador.toString()) });
    }

    subirDocumentosDevolucion(documentos: Documento[]): Observable<any> {
        return this.requester.put<any>(this.REQUEST_URL + "cargadevolucionbloque", documentos, {});
    }

    retirarNoValidados(guia: Guia) {
        return this.requester.put<any>(this.REQUEST_URL + guia.id + "/retiro", null, {});
    }

    getCantidadDocumentosPorGuia(guia: Guia) {
        return this.requester.get<any>(this.REQUEST_URL + guia.id + "/documentos" + null, {});
    }

    registrarGuia(guia: Guia): Observable<Guia> {
        return this.requester.post<Guia>(this.REQUEST_URL, guia, {});
    }

    enviarGuiaRegular(guiaId: number) {
        return this.requester.put<Guia>(this.REQUEST_URL + guiaId.toString() + "/envio", null, {});
    }

    enviarGuiaBloque(guiaId: number) {
        return this.requester.put<Guia>(this.REQUEST_URL + guiaId.toString() + "/enviobloque", null, {});
    }

    modificarGuia(guia: Guia) {
        return this.requester.put<Guia>(this.REQUEST_URL + guia.id.toString(), guia, {});
    }

    eliminarGuia(guiaId: number) {
        return this.requester.delete<Guia>(this.REQUEST_URL + guiaId.toString(), {});
    }

    listarGuiasPorProcesar(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "procesarguias", {});
    }

    listarGuiasBloquePorCerrar(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "guiasbloque", {});
    }

    listarGuiasSinCerrar(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "sincerrar", {});
    }

    getFechaCreacion(guia: Guia): Date {
        return guia.seguimientosGuia.find(seguimientoDocumento =>
            seguimientoDocumento.estadoGuia.id === 1
        ).fecha;
    }

    getFechaEnvio(guia: Guia): Date {
        let seguimientoDocumento = guia.seguimientosGuia.find(seguimientoDocumento =>
            seguimientoDocumento.estadoGuia.id === 2
        );

        if (seguimientoDocumento == null) {
            return null;
        }
        return seguimientoDocumento.fecha;
    }

    getEstadoGuia(guia: Guia): EstadoGuia {
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

    getSeguimientoGuiaByEstadoGuiaId(guia: Guia, estadoGuiaId: number): SeguimientoGuia {
        return guia.seguimientosGuia.find(seguimientoDocumento =>
            seguimientoDocumento.estadoGuia.id === estadoGuiaId
        )
    }

    asignarFechaDescarga(guia: Guia) {
        return this.requester.put<any>(this.REQUEST_URL + guia.id.toString() + "/descarga", null, {});
    }

    listarDocumentosByGuiaId(guia: Guia): Observable<Documento[]> {
        return this.requester.get<Documento[]>(this.REQUEST_URL + guia.id.toString() + "/documentos", {});
    }

    getDocumentoGuia(documento: Documento): Observable<DocumentoGuia> {
        return this.requester.get<DocumentoGuia>(this.REQUEST_URL + documento.id + "/documentoguia", {})
    }

    exportarDocumentosGuia(documentos, guia) {
        let objects = [];
        documentos.forEach(documento => {
            objects.push({
                "Guía": guia.numeroGuia,
                "Autogenerado": documento.documentoAutogenerado,
                "Guía + Autogenerado": guia.numeroGuia + documento.documentoAutogenerado,
                "Sede Remitente": guia.sede.nombre,
                "Plazo de Distribución": documento.envio.plazoDistribucion.nombre,
                "Tipo de Seguridad": documento.envio.tipoSeguridad.nombre,
                "Tipo de Servicio": documento.envio.tipoServicio.nombre,
                "Clasificación": documento.envio.clasificacion.nombre,
                "Producto": documento.envio.producto ? documento.envio.producto.nombre : 'NO TIENE',
                "Razón Social": documento.razonSocialDestino,
                "Contacto": documento.contactoDestino,
                "Departamento": documento.distrito.provincia.departamento.nombre,
                "Provincia": documento.distrito.provincia.nombre,
                "Distrito": documento.distrito.nombre,
                "Direccion": documento.direccion,
                "Referencia": documento.referencia,
                "Teléfono": documento.telefono
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Guia: " + guia.numeroGuia);
    }

    exportarResultadosGuia(documentos, guia) {
        let objects = [];
        documentos.forEach(documento => {
            if((this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre=="EXTRAVIADO / ROBADO") || (this.documentoService.getUltimoSeguimientoDocumento(documento).estadoDocumento.nombre!="NO DISTRIBUIBLE")) {
                objects.push({
                    "Guía": guia.numeroGuia,
                    "Autogenerado": documento.documentoAutogenerado,
                    "Guía + Autogenerado": guia.numeroGuia + documento.documentoAutogenerado,
                    "Sede Remitente": guia.sede.nombre,
                    "Plazo de Distribución": documento.envio.plazoDistribucion.nombre,
                    "Tipo de Seguridad": documento.envio.tipoSeguridad.nombre,
                    "Tipo de Servicio": documento.envio.tipoServicio.nombre,
                    "Clasificación": documento.envio.clasificacion.nombre,
                    "Producto": documento.envio.producto ? documento.envio.producto.nombre : 'NO TIENE',
                    "Razón Social": documento.razonSocialDestino,
                    "Contacto": documento.contactoDestino,
                    "Departamento": documento.distrito.provincia.departamento.nombre,
                    "Provincia": documento.distrito.provincia.nombre,
                    "Distrito": documento.distrito.nombre,
                    "Direccion": documento.direccion,
                    "Referencia": documento.referencia,
                    "Teléfono": documento.telefono,
                    "Estado": this.documentoService.getUltimoSeguimientoDocumento(documento).estadoDocumento.nombre,
                    "Motivo": this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre,
                    "Cargo": "",
                    "Rezago": "",
                    "Denuncia": ""
                })
            }
        });
        this.writeExcelService.jsonToExcel(objects, "Guia: " + guia.numeroGuia);
    }

    exportarGuias(guias) {
        let objects = [];
        guias.forEach(guia => {
            objects.push({
                "Número de guía": guia.numeroGuia,
                "Proveedor": guia.proveedor.nombre,
                "Plazo de distribución": guia.plazoDistribucion.nombre,
                "Tipo de servicio": guia.tipoServicio.nombre,
                "Tipo de seguridad": guia.tipoSeguridad.nombre,
                "Sede": guia.sede.nombre,
                "Total de documentos": guia.cantidadDocumentos,
                "Fecha creación": this.getFechaCreacion(guia),
                "Fecha límite": guia.fechaLimite,
                "Fecha envío": !this.utilsService.isUndefinedOrNullOrEmpty(this.getFechaEnvio(guia)) ? this.getFechaEnvio(guia) : ' ',
                "Fecha último estado": this.getFechaUltimoEstadoGuia(guia),
                "Estado": this.getEstadoGuia(guia).nombre
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Reporte de guías: ");
    }

    exportarGuiasBloque(guias) {
        let objects = [];
        guias.forEach(guia => {
            objects.push({
                "Número de guía": guia.numeroGuia,
                "Proveedor": guia.proveedor.nombre,
                "Plazo de distribución": guia.plazoDistribucion.nombre,
                "Tipo de servicio": guia.tipoServicio.nombre,
                "Tipo de seguridad": guia.tipoSeguridad.nombre,
                "Sede": guia.sede.nombre,
                "Pendiente de resultado": guia.cantidadDocumentosPendientes,
                "Total de documentos": guia.cantidadDocumentos,
                "Fecha creación": this.getFechaCreacion(guia),
                "Fecha límite": guia.fechaLimite,
                "Fecha envío": !this.utilsService.isUndefinedOrNullOrEmpty(this.getFechaEnvio(guia)) ? this.getFechaEnvio(guia) : ' ',
                "Fecha último estado": this.getFechaUltimoEstadoGuia(guia),
                "Estado": this.getEstadoGuia(guia).nombre
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Reporte de guías bloque: ");
    }


}