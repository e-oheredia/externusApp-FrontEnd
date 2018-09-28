import { Departamento } from "./departamento.model";

export class Provincia {
    constructor(public id: number, public nombre:string, public departamento: Departamento, public ubigeo: string){}
}