import { PlazoDistribucion } from './plazodistribucion.model';
import { Ambito } from './ambito.model';
export class Proveedor {
    constructor(){}
    public id: number;
    public nombre:string;
    public plazosDistribucion: PlazoDistribucion[];
    public activo: boolean;
    public ambitos: Ambito[];
}