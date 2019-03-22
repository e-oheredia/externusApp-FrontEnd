import { PlazoDistribucion } from '../../model/plazodistribucion.model';
import { BuzonService } from './buzon.service';
import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subscription, Subject } from "rxjs";

@Injectable()
export class PlazoDistribucionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PLAZO_DISTRIBUCION_URL;
    BUZON_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.BUZON_URL;
    AREA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AREA_URL;
    PROVEEDOR_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;

    constructor(private requester: RequesterService, private buzonService: BuzonService) {
        this.listarPlazosDistribucion().subscribe(
            plazosDistribucion => {
                this.plazosDistribucion = plazosDistribucion;
                this.plazosDistribucionChanged.next(this.plazosDistribucion);
            }
        )
        this.buzonService.buzonActualChanged.subscribe(
            buzonActual => {
                this.buzonPlazoDistribucionPermitidoSubscription = this.listarPlazoDistribucionPermititoByBuzonId(buzonActual.id)
                    .subscribe(
                        data => {
                            this.buzonPlazoDistribucionPermitido = data.plazoDistribucion;
                            this.areaPlazoDistribucionPermitidoSubscription = this.listarPlazoDistribucionPermititoByAreaId(buzonActual.area.id)
                                .subscribe(
                                    data2 => {
                                        this.areaPlazoDistribucionPermitido = data2.plazoDistribucion;
                                        this.plazoDistribucionPermitido = this.buzonPlazoDistribucionPermitido;
                                        if (this.areaPlazoDistribucionPermitido.id > this.buzonPlazoDistribucionPermitido.id) {
                                            this.plazoDistribucionPermitido = this.areaPlazoDistribucionPermitido;                                            
                                        }
                                        this.plazoDistribucionPermitidoChanged.next(this.plazoDistribucionPermitido);
                                    }
                                );
                        }
                    );

            }
        )

    }

    private plazosDistribucion: PlazoDistribucion[];
    private buzonPlazoDistribucionPermitido: PlazoDistribucion;
    private areaPlazoDistribucionPermitido: PlazoDistribucion;
    private plazoDistribucionPermitido: PlazoDistribucion;

    getPlazoDistribucionPermitido(): PlazoDistribucion {
        return this.plazoDistribucionPermitido;
    }

    public plazoDistribucionPermitidoChanged = new Subject<PlazoDistribucion>(); 
    public plazosDistribucionChanged = new Subject<PlazoDistribucion[]>();

    

    buzonPlazoDistribucionPermitidoSubscription: Subscription;
    areaPlazoDistribucionPermitidoSubscription: Subscription;


    public getPlazosDistribucion(): PlazoDistribucion[] {
        return this.plazosDistribucion;
    }

    listarPlazosDistribucion(): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL + "activos", {});
    }

    extraerId(id: String){
        return parseInt(id.substring(1,2));
    }

    agregarPlazoDistribucion(plazo: PlazoDistribucion): Observable<PlazoDistribucion>{
        return this.requester.post<PlazoDistribucion>(this.REQUEST_URL, plazo, {});
    }

    modificarPlazoDistribucion(id:number, plazo: PlazoDistribucion): Observable<PlazoDistribucion> {
        return this.requester.put<PlazoDistribucion>(this.REQUEST_URL + id, plazo, {});
    }

    listarPlazoDistribucionPermititoByBuzonId(buzonId: number): Observable<PlazoDistribucion | any> {
        return this.requester.get<PlazoDistribucion | any>(this.BUZON_REQUEST_URL + buzonId.toString() + "/plazodistribucionpermitido", {});
    }

    listarPlazoDistribucionPermititoByAreaId(areaId: number): Observable<PlazoDistribucion | any> {
        return this.requester.get<PlazoDistribucion | any>(this.AREA_REQUEST_URL + areaId.toString() + "/plazodistribucionpermitido", {});
    }

    listarPlazosDistribucionByProveedorId(proveedorId: number): Observable<PlazoDistribucion | any> {
        return this.requester.get<PlazoDistribucion | any>(this.PROVEEDOR_REQUEST_URL + proveedorId.toString() + "/plazosdistribucion", {});
    }

    listarPlazosDistribucionAll(): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL, {});
    }
    
}