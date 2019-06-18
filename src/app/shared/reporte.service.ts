import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";
import { RequesterService } from "./requester.service";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()

export class ReporteService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REPORTE_URL;

    constructor(private requester: RequesterService) {

    }

    getvolumen(fechaini: Date, fechafin: Date): any {
        return this.requester.get(this.REQUEST_URL + 'volumen', { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteVolumenporSede(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "volumen/porsede", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteVolumenporproveedorandplazo(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "volumen/plazodistribucion", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteEficaciaEstadosPorProveedor(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "eficacia", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteEficienciaPorCourier(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "eficiencia", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteEficienciaCourierPorPlazos(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "eficiencia/courierporplazo", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    cantidadDevolucionPorTipoDevolucion(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "cargos/devolucionportipo", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getControlCargosDocumentosDenuncias(fechaini: Date, fechafin: Date, id: number): any {
        return this.requester.get<any>(this.REQUEST_URL + "control/" + id + "/estado/", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getindicadorvolumen(fechaini: Date, fechafin: Date): any {
        return this.requester.get(this.REQUEST_URL + 'indicadorvolumen', { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getReporteIndicadorEficaciaGrafico(fechaini: Date, fechafin: Date): any {
        return this.requester.get<any>(this.REQUEST_URL + "indicadoreficacia", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    getindicadoreficiencia(fechaini: Date, fechafin: Date): any {
        return this.requester.get(this.REQUEST_URL + 'indicadoreficiencia', { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }
    

}