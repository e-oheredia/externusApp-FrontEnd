import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoDevolucion } from "src/model/tipodevolucion.model";

@Injectable()
export class TipoDevolucionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_DEVOLUCION_URL;

    public tiposDevolucionChanged = new Subject<TipoDevolucion[]>();
    private tiposDevolucion: TipoDevolucion[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarTiposDevolucionAll().subscribe(
            tiposDevolucion => {
                this.tiposDevolucion = tiposDevolucion;
                this.tiposDevolucionChanged.next(this.tiposDevolucion);
            }
        )
    }

    getTiposDevolucion(): TipoDevolucion[] {
        return this.tiposDevolucion;
    }

    listarTiposDevolucionAll(): Observable<TipoDevolucion[]> {
        return this.requester.get<TipoDevolucion[]>(this.REQUEST_URL, {});
    }
}