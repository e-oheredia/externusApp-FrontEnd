import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Region } from "src/model/region.model";

@Injectable()
export class RegionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;

    constructor(private requester: RequesterService ){
        this.listarRegionesAll().subscribe(
            regiones => {
                this.regiones = regiones;
                this.regionesChanged.next(this.regiones);
            }
        )
    } 
    
    private regiones: Region[];
    
    getRegiones(): Region[] {
        return this.regiones;
    }

    public regionesChanged = new Subject<Region[]>();

    listarRegionesAll(): Observable<Region[]> {
        return this.requester.get<Region[]>(this.REQUEST_URL, {});
    }

    agregarRegion(region: Region): Observable<Region>{
        return this.requester.post<Region>(this.REQUEST_URL, region, {});
    }

    modificarRegion(id:number, region:Region): Observable<Region> {
        return this.requester.put<Region>(this.REQUEST_URL + id + "/diaslaborables", region, {});
    }


}