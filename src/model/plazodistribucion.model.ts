import { TipoPlazoDistribucion } from "./tipoplazodistribucion.model";
import { Ambito } from "./ambito.model";
import { Region } from "./region.model";

export class PlazoDistribucion {
    // constructor(public id: number, public nombre:string, public tipoPlazoDistribucion: TipoPlazoDistribucion, public tiempoEnvio: number , public activo: boolean){}
    constructor(
        public id: number, 
        public nombre:string, 
        public tipoPlazoDistribucion: TipoPlazoDistribucion, 
        public rutaAutorizacion: string, 
        public tiempoEnvio: number ,
        public activo: boolean
        ){}
        public ambitos: Ambito[] = []
}