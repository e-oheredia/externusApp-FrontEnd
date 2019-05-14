import { DocumentoGuia } from '../../model/documentoguia.model';
import { AppSettings } from './app.settings';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";

@Injectable()
export class DocumentoGuiaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DOCUMENTO_GUIA_URL;

    GUIA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.GUIA_URL;

    constructor(private requester: RequesterService){}

    validarDocumentoGuia(guiaId: number, documentoId: number): Observable<DocumentoGuia> {
        return this.requester.put<DocumentoGuia>(this.GUIA_REQUEST_URL + guiaId.toString() + "/" + AppSettings.DOCUMENTO_URL + documentoId.toString() + "/" +   "validacion", null, {});
    }    

}
