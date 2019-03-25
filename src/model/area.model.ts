import { Sede} from "./sede.model";
import { PlazoDistribucion } from "./plazodistribucion.model";

export class Area {
    constructor(
        public id: number, 
        public nombre:string, 
        public codigo: String, 
        public sede: Sede,
        public plazoDistribucionPermtido: PlazoDistribucion
        ) {}
}