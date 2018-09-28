import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoDocumento } from "../../model/tipodocumento.model";

@Injectable()
export class TipoDocumentoService{

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_DOCUMENTO_URL;

    constructor(private requester: RequesterService ){
        this.listarTiposDocumento().subscribe(
            tiposDocumento => {
                this.tiposDocumento = tiposDocumento;
                this.tiposDocumentoChanged.next(this.tiposDocumento);
            }
        );

    }
    private tiposDocumento: TipoDocumento[];

    public tiposDocumentoChanged = new Subject<TipoDocumento[]>();

    

    public getTiposDocumento(): TipoDocumento[]{
        return this.tiposDocumento;
    }    

    listarTiposDocumento(): Observable<TipoDocumento[]>{
        return this.requester.get<TipoDocumento[]>(this.REQUEST_URL, {});
    }

}