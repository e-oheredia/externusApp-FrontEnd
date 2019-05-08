import { Dia } from "./dia.model";

export class DiaLaborable {
    constructor(){}
    public id: number;
    public dia: Dia;
    public activo: any | boolean;
    public inicio: string;
    public fin: string;
}