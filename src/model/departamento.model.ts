import { Pais } from "./pais.model";

export class Departamento {
    constructor(public id: number, public nombre:string, public pais: Pais, public ubigeo: string){}
}