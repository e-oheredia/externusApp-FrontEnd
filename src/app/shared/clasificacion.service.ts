import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Clasificacion } from "src/model/clasificacion.model";

@Injectable()
export class ClasificacionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.CLASIFICACION;

    private clasificacionesActivas: Clasificacion[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarClasificacionesActivos().subscribe(
            clasificacionesActivas => {
                this.clasificacionesActivas = clasificacionesActivas;
                this.clasificacionesChanged.next(this.clasificacionesActivas);
            }
        )
    }

    public clasificacionesChanged = new Subject<Clasificacion[]>();

    getClasificaciones(): Clasificacion[] {
        return this.clasificacionesActivas;
    }

    listarClasificacionesActivos(): Observable<Clasificacion[]> {
        return this.requester.get<Clasificacion[]>(this.REQUEST_URL + "activos", {});
    }

    listarClasificacionesAll(): Observable<Clasificacion[]> {
        return this.requester.get<Clasificacion[]>(this.REQUEST_URL, {});
    }

    agregarClasificacion(clasificacion: Clasificacion): Observable<Clasificacion> {
        return this.requester.post<Clasificacion>(this.REQUEST_URL, clasificacion, {});
    }

    modificarClasificacion(id: number, clasificacion: Clasificacion): Observable<Clasificacion> {
        return this.requester.put<Clasificacion>(this.REQUEST_URL + id, clasificacion, {});
    }


}