import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoSeguridad } from "../../model/tiposeguridad.model";

@Injectable()
export class TipoSeguridadService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_SEGURIDAD_URL;

    constructor(private requester: RequesterService) {
        this.listarTiposSeguridad().subscribe(
            tiposSeguridad => {
                this.tiposSeguridad = tiposSeguridad;
                this.tiposSeguridadChanged.next(this.tiposSeguridad);
            }
        )
    }

    private tiposSeguridad: TipoSeguridad[];
    public tiposSeguridadChanged = new Subject<TipoSeguridad[]>();



    listarTiposSeguridad(): Observable<TipoSeguridad[]> {
        return this.requester.get<TipoSeguridad[]>(this.REQUEST_URL, {});
    }

}