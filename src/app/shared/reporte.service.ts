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

    getReporteEficienciaPorCourier(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "eficiencia/porcourier", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteEficienciaCourierPorPlazos(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "eficiencia/courierporplazo", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    cantidadDevolucionPorTipoDevolucion(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "cargos/devolucionportipo", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getControlCargosDocumentosDenuncias(fechaini: Date, fechafin: Date, id:number): any {
        return this.requester.get<any>(this.REQUEST_URL + "control/"+ id + "/estado" , {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }


}