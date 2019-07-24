import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { TipoServicio } from "../../model/tiposervicio.model";
import { AppSettings } from "./app.settings";

@Injectable()
export class TipoServicioService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_SERVICIO_URL;

    public tiposServicioChanged = new Subject<TipoServicio[]>();
    private tiposServicio: TipoServicio[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarTiposServicio().subscribe(
            tiposServicio => {
                this.tiposServicio = tiposServicio;
                this.tiposServicioChanged.next(this.tiposServicio);
            }
        )
    }

    getTiposServicio(): TipoServicio[] {
        return this.tiposServicio;
    }

    listarTiposServicio(): Observable<TipoServicio[]> {
        return this.requester.get<TipoServicio[]>(this.REQUEST_URL + "activos", {});
    }

    listarTiposServicioAll(): Observable<TipoServicio[]> {
        return this.requester.get<TipoServicio[]>(this.REQUEST_URL, {});
    }

    agregarTipoServicio(servicio: TipoServicio): Observable<TipoServicio> {
        return this.requester.post<TipoServicio>(this.REQUEST_URL, servicio, {});
    }

    modificarTipoServicio(id: number, servicio: TipoServicio): Observable<TipoServicio> {
        return this.requester.put<TipoServicio>(this.REQUEST_URL + id, servicio, {});
    }


}