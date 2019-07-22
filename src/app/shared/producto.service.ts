import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Producto } from "src/model/producto.model";

@Injectable()
export class ProductoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.PRODUCTO_URL;

    private productosActivos: Producto[];
    public productosChanged = new Subject<Producto[]>();

    constructor(
        private requester: RequesterService
    ) {
        this.listarProductosActivos().subscribe(
            productos => {
                this.productosActivos = productos;
                this.productosChanged.next(this.productosActivos);
            }
        )
    }

    getProductos(): Producto[] {
        return this.productosActivos;
    }

    listarProductosAll(): Observable<Producto[]> {
        return this.requester.get<Producto[]>(this.REQUEST_URL, {});
    }

    listarProductosActivos(): Observable<Producto[]> {
        return this.requester.get<Producto[]>(this.REQUEST_URL + "activos", {});
    }

    agregarProducto(producto: Producto): Observable<Producto> {
        return this.requester.post<Producto>(this.REQUEST_URL, producto, {});
    }

    modificarProducto(id: number, producto: Producto): Observable<Producto> {
        return this.requester.put<Producto>(this.REQUEST_URL + id, producto, {});
    }


}