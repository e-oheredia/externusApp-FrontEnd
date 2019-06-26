import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";
import { AmbitoDistrito } from "../../model/ambitodistrito";
import { WriteExcelService } from "./write-excel.service";

@Injectable()
export class AmbitoService {
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;
    REQUEST_URL2 = AppSettings.API_ENDPOINT + AppSettings.AMBITODISTRITO_URL;
    ;

    private ambitos: Ambito[];

    constructor
    (private requester: RequesterService, 
     private writeExcelService: WriteExcelService,
    ){
        
        this.listarAmbitosAll().subscribe(
            ambitos => {
                this.ambitos = ambitos;
                this.ambitosChanged.next(this.ambitos);
            }
        )
    }    
    
    getAmbitos(): Ambito[] { 
        return this.ambitos;
    }

    public ambitosChanged = new Subject<Ambito[]>();

    listarAmbitosAll(): Observable<Ambito[]> {
        return this.requester.get<Ambito[]>(this.REQUEST_URL + "ambitos", {});
    }

    listarAmbitosPorRegion(regionId: number): Observable<Ambito[]>{
        return this.requester.get<Ambito[]>(this.REQUEST_URL + regionId.toString() + "/ambitos/activos", {});
    }

    agregarAmbito(ambito: Ambito): Observable<Ambito>{
        return this.requester.post<Ambito>(this.REQUEST_URL, ambito, {});
    }

    modificarAmbito(id:number, ambito: Ambito): Observable<Ambito> {
        return this.requester.put<Ambito>(this.REQUEST_URL + id + "/ambitos", ambito, {});
    }

    listarAmbitoDistritos() :Observable< AmbitoDistrito[]> {
        return this.requester.get<AmbitoDistrito[]>(this.REQUEST_URL2, {});
    }

    exportarAmbitoDistrito(ambitodistrito) {
        let objects = [];
        ambitodistrito.forEach(adistrito => {
            objects.push({
                "Ubigeo": adistrito.distrito.ubigeo, 
                "Departamento": adistrito.distrito.provincia.departamento.nombre,
                "Provincia":  adistrito.distrito.provincia.nombre,
                "Distrito":adistrito.distrito.nombre,
                "Ambito":adistrito.ambito.nombre
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Ubigeo_Distrito_Ambito");
    }


}