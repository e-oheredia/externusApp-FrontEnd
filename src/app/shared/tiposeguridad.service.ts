import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoSeguridad } from "../../model/tiposeguridad.model";

@Injectable()
export class TipoSeguridadService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_SEGURIDAD_URL;
    private tiposSeguridad: TipoSeguridad[];

    public tiposSeguridadChanged = new Subject<TipoSeguridad[]>();

    constructor(
        private requester: RequesterService
    ) {
        this.listarTiposSeguridad().subscribe(
            tiposSeguridad => {
                this.tiposSeguridad = tiposSeguridad;
                this.tiposSeguridadChanged.next(this.tiposSeguridad);
            }
        )
    }

    getTiposSeguridad(): TipoSeguridad[] {
        return this.tiposSeguridad;
    }

    listarTiposSeguridad(): Observable<TipoSeguridad[]> {
        return this.requester.get<TipoSeguridad[]>(this.REQUEST_URL + "activos", {});
    }

    agregarTipoSeguridad(tipoSeguridad: TipoSeguridad): Observable<TipoSeguridad> {
        return this.requester.post<TipoSeguridad>(this.REQUEST_URL, tipoSeguridad, {});
    }

    modificarTipoSeguridad(id: number, tipoSeguridad: TipoSeguridad): Observable<TipoSeguridad> {
        return this.requester.put<TipoSeguridad>(this.REQUEST_URL + id, tipoSeguridad, {});
    }

    listarTiposSeguridadAll(): Observable<TipoSeguridad[]> {
        return this.requester.get<TipoSeguridad[]>(this.REQUEST_URL, {});
    }
}