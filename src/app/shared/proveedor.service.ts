import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Proveedor } from "../../model/proveedor.model";
import { Ambito } from "src/model/ambito.model";
import { Region } from "src/model/region.model";

@Injectable()
export class ProveedorService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;

    constructor(private requester: RequesterService){
        this.listarProveedores().subscribe(
            proveedores => {
                this.proveedores = proveedores;
                this.proveedoresChanged.next(this.proveedores);
            }
        )
    }

    private proveedores: Proveedor[];
    regiones: Region[];

    getProveedores(): Proveedor[] {
        return this.proveedores;
    }

    proveedoresChanged = new Subject<Proveedor[]>();

    listarProveedores(): Observable<Proveedor[]>{
        return this.requester.get<Proveedor[]>(this.REQUEST_URL + "activos", {});
    }

    extraerId(id: String){
        return parseInt(id.substring(1,2));
    }
// 
    agregarProveedor(proveedor: Proveedor): Observable<Proveedor> {
        return this.requester.post<Proveedor>(this.REQUEST_URL, proveedor, {});
    }

    modificarProveedor(id:number, proveedor: Proveedor): Observable<Proveedor> {
        return this.requester.put<Proveedor>(this.REQUEST_URL + id, proveedor, {});
    }
// 
    listarProveedoresAll(): Observable<Proveedor[]>{
        return this.requester.get<Proveedor[]>(this.REQUEST_URL, {});
    }


    
}