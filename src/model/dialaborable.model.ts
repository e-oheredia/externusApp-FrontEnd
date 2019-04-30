import { Dia } from "./dia.model";

export class DiaLaborable {
    constructor(){}
    public id: number;
    public dia: Dia;
    public activo: boolean;
    public horaInicio: string;
    public horaFinal: string;
}