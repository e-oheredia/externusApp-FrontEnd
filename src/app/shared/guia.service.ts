import { DocumentoService } from './documento.service';
import { SeguimientoGuia } from './../../model/seguimientoguia.model';
import { WriteExcelService } from './write-excel.service';
import { DocumentoGuia } from '../../model/documentoguia.model';
import { Guia } from '../../model/guia.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";

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

    registrarGuia(guia: Guia): Observable<Guia> {
        return this.requester.post<Guia>(this.REQUEST_URL, guia, {});
    }

    listarDocumentosGuiaValidados(guia: Guia): DocumentoGuia[] {
        return guia.documentosGuia.filter(documentoGuia => documentoGuia.validado === true);
    }

    retirarNoValidados(guia: Guia) {
        return this.requester.put<any>(this.REQUEST_URL + guia.id + "/retiro", null, {});
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

    listarGuiasEnviadas(): Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "paraproveedor", {});
    }

    listarGuiasSinCerrar() : Observable<Guia[]> {
        return this.requester.get<Guia[]>(this.REQUEST_URL + "sincerrar", {});
    }

    listarDocumentosGuiaByUltimoEstadoAndGuia(guia: Guia, estadoId: number): DocumentoGuia[] {
        return guia.documentosGuia.filter(
            documentoGuia => this.documentoService.getUltimoEstado(documentoGuia.documento).id === estadoId
        );
    }

    getFechaCreacion(guia: Guia): Date{
        return guia.seguimientosGuia.find(seguimientoDocumento => 
            seguimientoDocumento.estadoGuia.id === 1
        ).fecha;
    }

    getSeguimientoGuiaByEstadoGuiaId(guia: Guia, estadoGuiaId: number): SeguimientoGuia{
        return guia.seguimientosGuia.find(seguimientoDocumento => 
            seguimientoDocumento.estadoGuia.id === estadoGuiaId
        );
    }

    exportarDocumentosGuia(guia: Guia) {
        let objects = [];
        guia.documentosGuia.forEach(documentoGuia => {
            objects.push({
                "Guía": guia.numeroGuia, 
                "Autogenerado": documentoGuia.documento.documentoAutogenerado,
                "Guía + Autogenerado": guia.numeroGuia + documentoGuia.documento.documentoAutogenerado,
                "Sede Remitente": "LA MOLINA",
                "Plazo de Distribución": documentoGuia.documento.envio.plazoDistribucion.nombre,
                "Tipo de Seguridad": documentoGuia.documento.envio.tipoSeguridad.nombre,
                "Tipo de Documento": documentoGuia.documento.envio.tipoDocumento.nombre,
                "Razón Social": documentoGuia.documento.razonSocialDestino,
                "Contacto": documentoGuia.documento.contactoDestino,
                "Departamento": documentoGuia.documento.distrito.provincia.departamento.nombre,
                "Provincia": documentoGuia.documento.distrito.provincia.nombre,
                "Distrito": documentoGuia.documento.distrito.nombre,
                "Direccion": documentoGuia.documento.direccion,
                "Teléfono": documentoGuia.documento.telefono
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Guia: " + guia.numeroGuia);
    }

}