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

    getTiposSeguridad() : TipoSeguridad[] {
        return this.tiposSeguridad;
    }

    public tiposSeguridadChanged = new Subject<TipoSeguridad[]>();



    listarTiposSeguridad(): Observable<TipoSeguridad[]> {
        return this.requester.get<TipoSeguridad[]>(this.REQUEST_URL, {});
    }

    agregarTipoSeguridad(tipoSeguridad : TipoSeguridad) :Observable<TipoSeguridad>{
       return this.requester.post<TipoSeguridad>(this.REQUEST_URL,tipoSeguridad,{}); 
    }
    modificarTipoSeguridad(id: number, tipoSeguridad : TipoSeguridad) : Observable<TipoSeguridad>{
        return this.requester.put<TipoSeguridad>(this.REQUEST_URL + id, tipoSeguridad, {});
    }
}