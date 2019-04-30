import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { SubAmbito } from "src/model/subambito.model";

@Injectable()
export class SubAmbitoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AMBITO_URL;

    private subambitos: SubAmbito[];

    constructor(private requester: RequesterService ){
        /* NO EXISTEN SUB-AMBITOS ACTIVOS PUESTO QUE EL USUARIO NO 
        REQUIERE SUB-AMBITOS ACTIVOS EN ALGUNA VISTA*/
        
        // this.listarSubAmbitosActivos().subscribe(
        //     subambitos => {
        //         this.subambitosActivos = subambitos;
        //         this.subambitosChanged.next(this.subambitosActivos);
        //     }
        // )
    }    
    
    // getSubAmbitosActivos(): SubAmbito[] {
    //     return this.subambitos;
    // }

    public subambitosChanged = new Subject<SubAmbito[]>();

    // listarSubAmbitosActivos(): Observable<SubAmbito[]>{
    //     return this.requester.get<SubAmbito[]>(this.REQUEST_URL + "activos", {});
    // }

    listarSubAmbitosAll(): Observable<SubAmbito[]> {
        return this.requester.get<SubAmbito[]>(this.REQUEST_URL + "subambitos", {});
    }

    agregarSubAmbito(subambito: SubAmbito): Observable<SubAmbito>{
        return this.requester.post<SubAmbito>(this.REQUEST_URL, subambito, {});
    }

    modificarSubAmbito(id:number, subambito: SubAmbito): Observable<SubAmbito> {
        return this.requester.put<SubAmbito>(this.REQUEST_URL + id, subambito, {});
    }


}