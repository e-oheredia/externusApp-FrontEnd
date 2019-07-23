import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Sede } from 'src/model/sede.model';

@Injectable()
export class SedeDespachoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.SEDE_DESPACHO_URL;

    public sedesDespachoChanged = new Subject<Sede[]>();
    private sedesDespacho: Sede[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarSedesDespacho().subscribe(
            sedesDespacho => {
                this.sedesDespacho = sedesDespacho;
                this.sedesDespachoChanged.next(this.sedesDespacho);
            }
        )
    }

    getSedesDespacho(): Sede[] {
        return this.sedesDespacho;
    }

    listarSedesDespacho(): Observable<Sede[]> {
        return this.requester.get<Sede[]>(this.REQUEST_URL + "/sedesdespacho", {});
    }

}