import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Proveedor } from "../../model/proveedor.model";
import { Region } from "src/model/region.model";

@Injectable()
export class ProveedorService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;

    private proveedores: Proveedor[];
    proveedoresChanged = new Subject<Proveedor[]>();
    regiones: Region[];

    constructor(
        private requester: RequesterService
    ) {
        this.listarProveedoresActivos().subscribe(
            proveedores => {
                this.proveedores = proveedores;
                this.proveedoresChanged.next(this.proveedores);
            }
        )
    }

    getProveedores(): Proveedor[] {
        return this.proveedores;
    }

    listarProveedoresAll(): Observable<Proveedor[]> {
        return this.requester.get<Proveedor[]>(this.REQUEST_URL, {});
    }

    listarProveedoresActivos(): Observable<Proveedor[]> {
        return this.requester.get<Proveedor[]>(this.REQUEST_URL + "activos", {});
    }

    extraerId(id: String) {
        return parseInt(id.substring(1, 2));
    }

    agregarProveedor(proveedor: Proveedor): Observable<Proveedor> {
        return this.requester.post<Proveedor>(this.REQUEST_URL, proveedor, {});
    }

    modificarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
        return this.requester.put<Proveedor>(this.REQUEST_URL + id, proveedor, {});
    }

   /*  getProveedorByRegionId(proveedores: Proveedor[], regionId: number){
        return proveedores.forEach(proveedor=>{
            proveedor.ambitos.fi
        })
    } */

}