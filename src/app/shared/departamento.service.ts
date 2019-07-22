import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Departamento } from "../../model/departamento.model";
import { UtilsService } from "./utils.service";

@Injectable()
export class DepartamentoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DEPARTAMENTO_URL;
    PAIS_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PAIS_URL;

    constructor(
        private requester: RequesterService,
        private utilsService: UtilsService
    ) {
        this.listarDepartamentosPeru().subscribe(
            departamentosPeru => {
                this.departamentosPeru = departamentosPeru;
                this.departamentosPeruChanged.next(this.departamentosPeru);
            }
        )
    }

    private departamentosPeru: Departamento[];

    public departamentosPeruChanged = new Subject<Departamento[]>();

    public getDepartamentosPeru(): Departamento[] {
        return this.departamentosPeru;
    }

    listarDepartamentosPeru(): Observable<Departamento[]> {
        return this.requester.get<Departamento[]>(this.PAIS_REQUEST_URL + "1/" + AppSettings.DEPARTAMENTO_URL, {});
    }

    listarDepartamentoByNombre(nombre: string): Departamento {
        if (this.utilsService.isUndefinedOrNullOrEmpty(nombre)) {
            return null;
        }
        let departamentosFiltrados = this.departamentosPeru.filter(departamento => departamento.nombre.toUpperCase() === nombre.toUpperCase());
        return departamentosFiltrados[0] || null;
    }

}