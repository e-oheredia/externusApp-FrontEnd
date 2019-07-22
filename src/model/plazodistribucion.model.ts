import { TipoPlazoDistribucion } from "./tipoplazodistribucion.model";
import { Ambito } from "./ambito.model";
import { Region } from "./region.model";

export class PlazoDistribucion {

    constructor(
        public id: number,
        public nombre: string,
        public tiempoEnvio: number,
        public tipoPlazoDistribucion: TipoPlazoDistribucion,
        public rutaAutorizacion: string,
        public activo: boolean,
        public regiones: Region[] = []
    ) { }

}