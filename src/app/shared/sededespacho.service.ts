import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Sede } from 'src/model/sede.model';

@Injectable()
export class SedeDespachoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.SEDE_DESPACHO_URL;


    constructor(private requester: RequesterService) {

        this.listarSedesDespacho().subscribe(
            sedesDespacho => {
                this.sedesDespacho = sedesDespacho;
                this.sedesDespachoChanged.next(this.sedesDespacho);
            }
        )
    }

    private sedesDespacho: Sede[];

    getSedesDespacho(): Sede[]{
        return this.sedesDespacho;
    }

    public sedesDespachoChanged = new Subject<Sede[]>();

    listarSedesDespacho():Observable<Sede[]>{
        // return this.requester.get<Sede[]>(this.REQUEST_URL, {});
        return this.requester.get<Sede[]>(this.REQUEST_URL + "/sedesdespacho", {});
    }

}