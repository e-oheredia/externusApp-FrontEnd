import { Ambito } from "./ambito.model";

export class Feriado {
    constructor(){}
    public id: number;
    public nombre:string;
    public fecha: Date;
    public periodo: boolean;
    public ambito: Ambito[];
}