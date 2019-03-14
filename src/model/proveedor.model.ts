import { PlazoDistribucion } from './plazodistribucion.model';
export class Proveedor {
    constructor(public id: number, public nombre:string, public plazosDistribucion: PlazoDistribucion[], public activo: boolean){}
}