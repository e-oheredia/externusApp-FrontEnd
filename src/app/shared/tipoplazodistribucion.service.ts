import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { TipoPlazoDistribucion } from "src/model/tipoplazodistribucion.model";

@Injectable()
export class TipoPlazoDistribucionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPOPLAZODISTRIBUCION_URL;

    constructor(private requester: RequesterService){
        this.listarTiposPlazosDistribucion().subscribe(
            tiposPlazosDistribucion => {
                this.tiposPlazosDistribucion = tiposPlazosDistribucion;
                this.tiposPlazosDistribucionChanged.next(this.tiposPlazosDistribucion);
            }
        )
    }

    private tiposPlazosDistribucion: TipoPlazoDistribucion[];

    public getTiposPlazosDistribucion(): TipoPlazoDistribucion[] {
        return this.tiposPlazosDistribucion;
    }

    tiposPlazosDistribucionChanged = new Subject<TipoPlazoDistribucion[]>();

    public listarTiposPlazosDistribucion(): Observable<TipoPlazoDistribucion[]>{
        return this.requester.get<TipoPlazoDistribucion[]>(this.REQUEST_URL, {});
    }

}