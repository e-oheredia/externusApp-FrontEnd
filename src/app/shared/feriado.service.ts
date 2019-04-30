import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Feriado } from "src/model/feriado.model";

@Injectable()
export class FeriadoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.FERIADO_URL; //falta confirmar

    private feriado: Feriado[];

    constructor(private requester: RequesterService ){
        
        // this.listarFeriadosActivos().subscribe(
        //     feriadosActivos => {
        //         this.feriadosActivos = feriadosActivos;
        //         this.feriadoChanged.next(this.getFeriados);
        //     }
        // )

    }    
    
    // getFeriados(): Feriado[] {
    //     return this.feriado;
    // }

    public feriadoChanged = new Subject<Feriado[]>();

    // listarFeriadosActivos(): Observable<Feriado[]>{
    //     return this.requester.get<Feriado[]>(this.REQUEST_URL + "activos", {});
    // }

    listarFeriadosAll(): Observable<Feriado[]> {
        return this.requester.get<Feriado[]>(this.REQUEST_URL, {});
    }

    agregarFeriado(feriado: Feriado): Observable<Feriado>{
        return this.requester.post<Feriado>(this.REQUEST_URL, feriado, {});
    }

    modificarFeriado(id:number, feriado: Feriado): Observable<Feriado> {
        return this.requester.put<Feriado>(this.REQUEST_URL + id, feriado, {});
    }


}