import { PlazoDistribucion } from '../../model/plazodistribucion.model';
import { BuzonService } from './buzon.service';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subscription, Subject } from "rxjs";
import { HttpParams } from '../../../node_modules/@angular/common/http';
import { ReporteAsignacionPlazo } from 'src/model/reporteasignacionplazo.model';
import { WriteExcelService } from './write-excel.service';

@Injectable()
export class PlazoDistribucionService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PLAZO_DISTRIBUCION_URL;
    BUZON_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.BUZON_URL;
    AREA_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.AREA_URL;
    PROVEEDOR_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;
    PLAZO_DISTRIBUCION_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PLAZO_DISTRIBUCION_URL;

    private plazosDistribucion: PlazoDistribucion[];
    private buzonPlazoDistribucionPermitido: PlazoDistribucion;
    private areaPlazoDistribucionPermitido: PlazoDistribucion;
    private plazoDistribucionPermitido: PlazoDistribucion;
    public plazoDistribucionPermitidoChanged = new Subject<PlazoDistribucion>();
    public plazosDistribucionChanged = new Subject<PlazoDistribucion[]>();
    buzonPlazoDistribucionPermitidoSubscription: Subscription;
    areaPlazoDistribucionPermitidoSubscription: Subscription;

    constructor(
        private requester: RequesterService,
        private buzonService: BuzonService,
        private writeExcelService: WriteExcelService
    ) {
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

    getPlazoDistribucionPermitido(): PlazoDistribucion {
        return this.plazoDistribucionPermitido;
    }

    public getPlazosDistribucion(): PlazoDistribucion[] {
        return this.plazosDistribucion;
    }

    listarPlazosDistribucion(): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL + "activos", {});
    }

    getvolumen(fechaini: Date, fechafin: Date): any {
        return this.requester.get(this.REQUEST_URL + 'volumen', { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    listarReporteAsignacionPlazos(fechaini: Date, fechafin: Date) {
        return this.requester.get<ReporteAsignacionPlazo[]>(this.REQUEST_URL + "reporteplazos", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    agregarPlazoDistribucion(plazo: PlazoDistribucion): Observable<PlazoDistribucion> {
        return this.requester.post<PlazoDistribucion>(this.REQUEST_URL, plazo, {});
    }

    modificarPlazoDistribucion(id: number, plazo: PlazoDistribucion): Observable<PlazoDistribucion> {
        return this.requester.put<PlazoDistribucion>(this.REQUEST_URL + id, plazo, {});
    }

    listarPlazoDistribucionPermititoByBuzonId(buzonId: number): Observable<PlazoDistribucion | any> {
        return this.requester.get<PlazoDistribucion | any>(this.BUZON_REQUEST_URL + buzonId.toString() + "/plazodistribucionpermitido", {});
    }

    listarPlazoDistribucionPermititoByAreaId(areaId: number): Observable<PlazoDistribucion | any> {
        return this.requester.get<PlazoDistribucion | any>(this.AREA_REQUEST_URL + areaId.toString() + "/plazodistribucionpermitido", {});
    }

    listarPlazosDistribucionAll(): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL, {});
    }

    listarPlazosDistribucionByDistritoId(distritoId: number): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL + distritoId.toString() + "/distrito", {});
    }

    listarPlazosDistribucionByRegionId(regionId: number): Observable<PlazoDistribucion[]> {
        return this.requester.get<PlazoDistribucion[]>(this.REQUEST_URL + regionId.toString() + "/plazoregion", {});
    }

    exportarAutorizaciones(data) {
        let objects = [];
        Object.keys(data).forEach(key => {
            if (key === "data") {
                var obj1 = data[key];
                obj1.forEach(entidad => {
                    objects.push({
                        "Tipo de Asignación": entidad.tipo,
                        "Buzón/Area": entidad.barea,
                        "Plazo Actual": entidad.plazo,
                        "Fecha de cambio": entidad.fechaCambio,
                    })
                })
            }
        });

        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Áreas: ");

    }



}