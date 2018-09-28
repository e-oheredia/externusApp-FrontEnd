import { Provincia } from "./provincia.model";

export class Distrito {
    constructor(public id: number, public nombre:string, public provincia: Provincia, public ubigeo: string){}
}