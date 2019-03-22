import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Buzon } from "../../model/buzon.model";
import { Subject } from "rxjs";
import { PlazoDistribucion } from '../../model/plazodistribucion.model';
import { WriteExcelService } from './write-excel.service';


@Injectable()
export class BuzonService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.BUZON_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService) { }



    public buzonActualChanged = new Subject<Buzon>();

    private buzonesEmpleadoAutenticado: Buzon[];

    public getBuzonesEmpleadoAutenticado(): Buzon[] {
        return this.buzonesEmpleadoAutenticado;
    }

    public setBuzonesEmpleadoAutenticado(buzones: Buzon[]) {
        this.buzonesEmpleadoAutenticado = buzones;
    }

    private buzonActual: Buzon;

    public getBuzonActual(): Buzon {
        return this.buzonActual;
    }

    public setBuzonActual(buzon: Buzon) {
        this.buzonActual = buzon;
        this.buzonActualChanged.next(this.buzonActual);
    }

    public listarBuzonesAll(): Observable<Buzon[]> {
        return this.requester.get<Buzon[]>(this.REQUEST_URL, {});
    }

    public actualizarPlazoDistribucionPermitido(buzonId: number, plazoDistribucionPermitido: PlazoDistribucion): Observable<PlazoDistribucion> {
        return this.requester.put<PlazoDistribucion>(this.REQUEST_URL + buzonId.toString() + "/plazosdistribucion", plazoDistribucionPermitido, {});
    }

    listarPermisosPorBuzon(buzon): Observable<Buzon[]>{
        return this.requester.get<Buzon[]>(this.REQUEST_URL + "" , {})
    }

    exportarPermisosDePlazosPorBuzon(buzones) {
        let objects = [];
        buzones.forEach(buzon => {
            objects.push({
                "Usuario": buzon.nombre,
                "Área": buzon.area.nombre,
                "Sede": buzon.area.sede.nombre,
                // "Plazos": this.listarPermisosPorBuzon(buzon).map(permisos => permisos.nombre).join(", ")
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Buzón: ");
    }


}