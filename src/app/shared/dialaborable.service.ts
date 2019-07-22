import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { DiaLaborable } from "src/model/dialaborable.model";

@Injectable()
export class DiaLaborableService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_SERVICIO_URL;

    private diaslaborablesActivos: DiaLaborable[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarDiasLaborablesActivos().subscribe(
            diaslaborablesActivos => {
                this.diaslaborablesActivos = diaslaborablesActivos;
                this.diaslaborablesChanged.next(this.diaslaborablesActivos);
            }
        )
    }

    public diaslaborablesChanged = new Subject<DiaLaborable[]>();

    getDiasLaborables(): DiaLaborable[] {
        return this.diaslaborablesActivos;
    }

    listarDiasLaborablesActivos(): Observable<DiaLaborable[]> {
        return this.requester.get<DiaLaborable[]>(this.REQUEST_URL + "activos", {});
    }

    listarDiasLaborablesAll(): Observable<DiaLaborable[]> {
        return this.requester.get<DiaLaborable[]>(this.REQUEST_URL + "diaslaborables", {});
    }

    agregarDiaLaborable(dialaborable: DiaLaborable): Observable<DiaLaborable> {
        return this.requester.post<DiaLaborable>(this.REQUEST_URL, dialaborable, {});
    }

    modificarDiaLaborable(id: number, dialaborable: DiaLaborable): Observable<DiaLaborable> {
        return this.requester.put<DiaLaborable>(this.REQUEST_URL + id, dialaborable, {});
    }


}