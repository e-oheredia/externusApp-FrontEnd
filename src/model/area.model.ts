import { Sede} from "./sede.model";

export class Area {
    constructor(public id: number, public nombre:string, public codigo: String, public sede: Sede){}
}