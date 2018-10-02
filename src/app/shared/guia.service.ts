import { DocumentoGuia } from '../../model/documentoguia.model';
import { Guia } from '../../model/guia.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";

@Injectable()
export class GuiaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.GUIA_URL;

    constructor(private requester: RequesterService) {

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
        return this.requester.get<Guia[]>(this.REQUEST_URL + "enviados", {});
    }

}