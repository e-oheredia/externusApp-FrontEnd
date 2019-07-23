import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Distrito } from "../../model/distrito.model";
import { UtilsService } from "./utils.service";

@Injectable()
export class DistritoService {

    PROVINCIA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVINCIA_URL;
    DISTRITO_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DISTRITO_URL;

    private distritos: Distrito[];
    public distritosChanged = new Subject<Distrito[]>();

    constructor(
        private requester: RequesterService,
        private utilsService: UtilsService
    ) {
        this.listarAll().subscribe(
            distritos => {
                this.distritos = distritos;
                this.distritosChanged.next(this.distritos);
            }
        )
    }

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