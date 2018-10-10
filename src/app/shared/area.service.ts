import { Area } from './../../model/area.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";


@Injectable()
export class AreaService {

    constructor(
        private requesterService: RequesterService
    ){}

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AREA_URL;

    listarAreasAll(): Observable<Area[]>{
        return this.requesterService.get(this.REQUEST_URL, {});
    }

}