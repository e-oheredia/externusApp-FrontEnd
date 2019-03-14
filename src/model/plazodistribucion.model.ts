import { TipoPlazoDistribucion } from "./tipoplazodistribucion.model";

export class PlazoDistribucion {
    constructor(public id: number, public nombre:string, public tipoPlazoDistribucion: TipoPlazoDistribucion, public tiempoEnvio: number , public activo: boolean){}
}