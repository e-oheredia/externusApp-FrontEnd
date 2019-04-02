import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";

import { Observable, Subject } from "rxjs";
import { TipoServicio } from "../../model/tiposervicio.model";
import { AppSettings } from "./app.settings";

@Injectable()
export class TipoServicioService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_SERVICIO_URL;

    constructor(private requester: RequesterService ){
        this.listarTiposServicio().subscribe(
            tiposServicio => {
                this.tiposServicio = tiposServicio;
                this.tiposServicioChanged.next(this.tiposServicio);
            }
        )
    }

    private tiposServicio: TipoServicio[];
    
    getTiposServicio(): TipoServicio[] {
        return this.tiposServicio;
    }

    public tiposServicioChanged = new Subject<TipoServicio[]>();



    listarTiposServicio(): Observable<TipoServicio[]>{
        return this.requester.get<TipoServicio[]>(this.REQUEST_URL + "activos", {});
    }

    listarTiposServicioAll(): Observable<TipoServicio[]> {
        return this.requester.get<TipoServicio[]>(this.REQUEST_URL , {});
    }


}