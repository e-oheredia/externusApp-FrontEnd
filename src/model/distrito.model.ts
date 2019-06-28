import { Provincia } from "./provincia.model";
import { Ambito } from "./ambito.model";

export class Distrito {

    constructor(  ){}

    public id: number;
    public nombre:string; 
    public provincia: Provincia;
    public ubigeo: string;
    public ambito: Ambito;

}