import { Region } from "./region.model";
import { PlazoDistribucion } from "./plazodistribucion.model";

export class Ambito {
    constructor(        
    ) {}

    public id: number;
        public nombre:string; 
        public activo: boolean;
        public region: Region;
        public plazos: PlazoDistribucion[] = [];
}   