import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";

@Injectable()
export class AmbitoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;

    private ambitos: Ambito[];

    constructor(private requester: RequesterService ){

        /* NO EXISTEN AMBITOS ACTIVOS PUESTO QUE EL USUARIO NO 
        REQUIERE AMBITOS ACTIVOS EN ALGUNA VISTA*/
        
        // this.listarAmbitosActivos().subscribe(
        //     ambitos => {
        //         this.ambitos = ambitos;
        //         this.ambitosChanged.next(this.ambitos);
        //     }
        // )
    }    
    
    getAmbitosActivos(): Ambito[] { 
        return this.ambitos;
    }

    public ambitosChanged = new Subject<Ambito[]>();

    // listarAmbitosActivos(): Observable<Ambito[]>{
    //     return this.requester.get<Ambito[]>(this.REQUEST_URL + "activos", {});
    // }

    listarAmbitosAll(): Observable<Ambito[]> {
        return this.requester.get<Ambito[]>(this.REQUEST_URL + "ambitos", {});
    }

    agregarAmbito(ambito: Ambito): Observable<Ambito>{
        return this.requester.post<Ambito>(this.REQUEST_URL, ambito, {});
    }

    modificarAmbito(id:number, ambito: Ambito): Observable<Ambito> {
        return this.requester.put<Ambito>(this.REQUEST_URL + id + "/ambitos", ambito, {});
    }


}