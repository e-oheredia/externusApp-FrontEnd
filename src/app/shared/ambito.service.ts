import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";

@Injectable()
export class AmbitoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AMBITO_URL;

    constructor(private requester: RequesterService ){
        this.listarAmbitosAll().subscribe(
            ambitos => {
                this.ambitos = ambitos;
                this.ambitosChanged.next(this.ambitos);
            }
        )
    } 
    
    private ambitos: Ambito[];
    
    getAmbitos(): Ambito[] {
        return this.ambitos;
    }

    public ambitosChanged = new Subject<Ambito[]>();

    listarAmbitosAll(): Observable<Ambito[]> {
        return this.requester.get<Ambito[]>(this.REQUEST_URL, {});
    }

    agregarAmbito(ambito: Ambito): Observable<Ambito>{
        return this.requester.post<Ambito>(this.REQUEST_URL, ambito, {});
    }

    modificarAmbito(id:number, ambito:Ambito): Observable<Ambito> {
        return this.requester.put<Ambito>(this.REQUEST_URL + id + "/diaslaborables", ambito, {});
    }


}