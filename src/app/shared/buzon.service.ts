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
        private writeExcelService: WriteExcelService
    ) { }

    public buzonActualChanged = new Subject<Buzon>();
    private buzonesEmpleadoAutenticado: Buzon[];
    private buzonActual: Buzon;

    public getBuzonActual(): Buzon {
        return this.buzonActual;
    }

    public listarBuzonesAll(): Observable<Buzon[]> {
        return this.requester.get<Buzon[]>(this.REQUEST_URL, {});
    }

    public setBuzonesEmpleadoAutenticado(buzones: Buzon[]) {
        this.buzonesEmpleadoAutenticado = buzones;
    }

    public setBuzonActual(buzon: Buzon) {
        this.buzonActual = buzon;
        this.buzonActualChanged.next(this.buzonActual);
    }

    public actualizarPlazoDistribucionPermitido(buzonId: number, plazoDistribucionPermitido: PlazoDistribucion, file: File): Observable<PlazoDistribucion> {
        let form: FormData = new FormData;
        form.append("plazoDistribucion", new Blob([JSON.stringify(plazoDistribucionPermitido)],
            { type: "application/json" }));

        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.put<PlazoDistribucion>(this.REQUEST_URL + buzonId.toString() + "/plazosdistribucion", form, {});
    }

    listarPermisosPorBuzon(buzon): Observable<Buzon[]> {
        return this.requester.get<Buzon[]>(this.REQUEST_URL + "", {})
    }

    exportarPermisosDePlazosPorBuzon(buzones) {
        let objects = [];
        buzones.forEach(buzon => {
            objects.push({
                "Usuario": buzon.nombre,
                "Área": buzon.area.nombre,
                "Sede": buzon.area.sede.nombre,
                "Plazos": buzon.plazoDistribucionPermitido ? buzon.plazoDistribucionPermitido.nombre : "-"
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Buzón: ");
    }


}