import { Area } from "./area.model";
import { PlazoDistribucion } from "./plazodistribucion.model";

export class Buzon {
    constructor(
        public id: number, 
        public nombre:string, 
        public area: Area, 
        public activo:boolean,
        public plazoDistribucionPermtido: PlazoDistribucion
        ) {}
}