import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";
import { RequesterService } from "./requester.service";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()

export class ReporteService{

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REPORTE_URL;

constructor(private requester : RequesterService ){
    
}

    getReporte(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL , {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

}