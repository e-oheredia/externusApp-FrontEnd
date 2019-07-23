import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoPeriodo } from "src/model/tipoperiodo.model";

@Injectable()
export class TipoPeriodoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_PERIODO_URL;

    public tiposPeriodoChanged = new Subject<TipoPeriodo[]>();
    private tiposPeriodo: TipoPeriodo[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarTiposPeriodoAll().subscribe(
            tiposPeriodo => {
                this.tiposPeriodo = tiposPeriodo;
                this.tiposPeriodoChanged.next(this.tiposPeriodo);
            }
        )
    }

    getTiposPeriodo(): TipoPeriodo[] {
        return this.tiposPeriodo;
    }

    listarTiposPeriodoAll(): Observable<TipoPeriodo[]> {
        return this.requester.get<TipoPeriodo[]>(this.REQUEST_URL, {});
    }
}