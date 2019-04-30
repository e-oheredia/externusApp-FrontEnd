import { Feriado } from "./feriado.model";
import { DiaLaborable } from "./dialaborable.model";

export class Ambito {
    constructor(){}
    public id: number;
    public nombre: string;
    public activo: boolean;
    //
    public diasHora: DiaLaborable[];
}