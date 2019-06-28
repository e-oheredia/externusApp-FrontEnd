import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Distrito } from "../../model/distrito.model";
import { UtilsService } from "./utils.service";
import { ReadExcelService } from "./read-excel.service";
import { AmbitoService } from "./ambito.service";

@Injectable()
export class DistritoService {

    constructor(
        private requester: RequesterService,
        private utilsService: UtilsService,
        private readExcelService: ReadExcelService,
        private ambitoService: AmbitoService
    ) {
        this.listarAll().subscribe(
            distritos => {
                this.distritos = distritos;
                this.distritosChanged.next(this.distritos);
            }
        )
    }

    PROVINCIA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVINCIA_URL;
    DISTRITO_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DISTRITO_URL;




    private distritos: Distrito[];
    public distritosChanged = new Subject<Distrito[]>();

    listarDistritosByProvinciaId(provinciaId: number): Observable<Distrito[]> {
        return this.requester.get<Distrito[]>(this.PROVINCIA_REQUEST_URL + provinciaId.toString() + "/" + AppSettings.DISTRITO_URL, {});
    }


    listarAll(): Observable<Distrito[]> {
        return this.requester.get<Distrito[]>(this.DISTRITO_REQUEST_URL, {});
    }

    listarDistritoByNombreDistritoAndNombreProvincia(nombreDistrito: string, nombreProvincia: string): Distrito {
        if (this.utilsService.isUndefinedOrNullOrEmpty(nombreDistrito)) {
            return null;
        }
        let distritosFiltrados = this.distritos.filter(distrito => distrito.nombre.toUpperCase() === nombreDistrito.toUpperCase());
        if (distritosFiltrados.length === 0) {
            return null;
        }
        return distritosFiltrados[0].provincia.nombre.toUpperCase() === nombreProvincia.toUpperCase() ? distritosFiltrados[0] : null;
    }


}