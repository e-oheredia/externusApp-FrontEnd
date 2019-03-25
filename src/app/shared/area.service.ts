import { PlazoDistribucion } from './../../model/plazodistribucion.model';
import { Area } from './../../model/area.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { WriteExcelService } from './write-excel.service';


@Injectable()
export class AreaService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AREA_URL;

    constructor(
        private requester: RequesterService,
        private writeExcelService: WriteExcelService
        ) { }

    listarAreasAll(): Observable<Area[]> {
        return this.requester.get<Area[]>(this.REQUEST_URL, {});
    }

    public actualizarPlazoDistribucionPermitido(areaId: number, plazoDistribucionPermitido: PlazoDistribucion): Observable<PlazoDistribucion> {
        return this.requester.put<PlazoDistribucion>(this.REQUEST_URL + areaId.toString() + "/plazosdistribucion", plazoDistribucionPermitido, {});
    }

    exportarPermisosDePlazosPorArea(areas) {
        let objects = [];
        areas.forEach(area => {
            objects.push({
                "Área": area.nombre,
                "Sede": area.sede.nombre,
                "Plazos": area.plazoDistribucionPermitido ? area.plazoDistribucionPermitido.nombre : "-"
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Áreas: ");
    }

}