import { Area } from "./area.model";
import { TipoPuesto } from "./tipopuesto.model";

export class Puesto {
    constructor(public id: number, public nombre:string, public tipoPuesto: TipoPuesto, public area: Area){}
}