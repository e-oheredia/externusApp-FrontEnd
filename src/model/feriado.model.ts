import { Region } from "./region.model";
import { TipoPeriodo } from "./tipoperiodo.model";

export class Feriado {
    constructor(){}
    public id: number;
    public nombre:string;
    public fecha: Date;
    public tipoperiodo: TipoPeriodo;
    public regiones: Region[];
}