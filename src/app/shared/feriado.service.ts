import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Feriado } from "src/model/feriado.model";

@Injectable()
export class FeriadoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.FERIADO_URL;

    public feriadoChanged = new Subject<Feriado[]>();

    constructor(
        private requester: RequesterService
    ) { }

    listarFeriadosAll(): Observable<Feriado[]> {
        return this.requester.get<Feriado[]>(this.REQUEST_URL, {});
    }

    agregarFeriado(feriado: Feriado): Observable<Feriado> {
        return this.requester.post<Feriado>(this.REQUEST_URL, feriado, {});
    }

    modificarFeriado(id: number, feriado: Feriado): Observable<Feriado> {
        return this.requester.put<Feriado>(this.REQUEST_URL + id, feriado, {});
    }

    eliminarFeriado(id: number): Observable<Feriado> {
        return this.requester.delete<Feriado>(this.REQUEST_URL + id.toString(), {});
    }

}