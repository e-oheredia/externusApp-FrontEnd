import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Producto } from "src/model/producto.model";

@Injectable()
export class ProductoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PRODUCTO_URL;

    constructor(private requester: RequesterService ){
        this.listarProductosActivos().subscribe(
            productos => {
                this.productosActivos = productos;
                this.productosChanged.next(this.productosActivos);
            }
        )
    }

    private productosActivos: Producto[];
    
    getProductos(): Producto[] {
        return this.productosActivos;
    }

    public productosChanged = new Subject<Producto[]>();



    listarProductosActivos(): Observable<Producto[]>{
        return this.requester.get<Producto[]>(this.REQUEST_URL + "activos", {});
    }

    listarProductosAll(): Observable<Producto[]> {
        return this.requester.get<Producto[]>(this.REQUEST_URL , {});
    }

    agregarProducto(producto: Producto): Observable<Producto>{
        return this.requester.post<Producto>(this.REQUEST_URL, producto, {});
    }

    modificarProducto(id:number, producto: Producto): Observable<Producto> {
        return this.requester.put<Producto>(this.REQUEST_URL + id, producto, {});
    }


}