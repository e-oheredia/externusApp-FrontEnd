import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";

@Injectable()
export class AmbitoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AMBITO_URL;

    private ambitosActivos: Ambito[];

    constructor(private requester: RequesterService ){
        /* NO EXISTEN AMBITOS ACTIVOS PUESTO QUE NO EXISTE
        UN MANTENIMIENTO DE AMBITOS Y TODOS SON ACTIVOS POR DAFAULT*/
        this.listarAmbitosAll().subscribe(
            ambitosActivos => {
                this.ambitosActivos = ambitosActivos;
                this.ambitosChanged.next(this.ambitosActivos);
            }
        )
    }    
    
    getAmbitos(): Ambito[] {
        return this.ambitosActivos;
    }

    public ambitosChanged = new Subject<Ambito[]>();

    // listarAmbitosActivos(): Observable<Ambito[]>{
    //     return this.requester.get<Ambito[]>(this.REQUEST_URL + "activos", {});
    // }

    listarAmbitosAll(): Observable<Ambito[]> {
        return this.requester.get<Ambito[]>(this.REQUEST_URL , {});
    }

    agregarAmbito(ambito: Ambito): Observable<Ambito>{
        return this.requester.post<Ambito>(this.REQUEST_URL, ambito, {});
    }

    modificarAmbito(id:number, ambito: Ambito): Observable<Ambito> {
        return this.requester.put<Ambito>(this.REQUEST_URL + id, ambito, {});
    }


}