import { TipoSede } from "./tiposede.model";
import { Distrito } from "./distrito.model";

export class Sede {

    constructor(
        public id: number,
        public nombre: string,
        public codigo: String,
        public tipoSede: TipoSede,
        public distrito: Distrito
    ) { }

}