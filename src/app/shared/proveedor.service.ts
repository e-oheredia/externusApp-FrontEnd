import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable, Subject } from "rxjs";
import { Proveedor } from "../../model/proveedor.model";

@Injectable()
export class ProveedorService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PROVEEDOR_URL;

    constructor(private requester: RequesterService){
        this.listarAll().subscribe(
            proveedores => {
                this.proveedores = proveedores;
                this.proveedoresChanged.next(this.proveedores);
            }
        )
    }

    private proveedores: Proveedor[];

    getProveedores(): Proveedor[] {
        return this.proveedores;
    }

    proveedoresChanged = new Subject<Proveedor[]>();

    listarAll(): Observable<Proveedor[]>{
        return this.requester.get<Proveedor[]>(this.REQUEST_URL, {});
    }
}