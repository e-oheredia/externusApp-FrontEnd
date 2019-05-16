import { Envio } from "./envio.model";

export class Inconsistencia {


    constructor(){
        this.resumen = "";
    }

    public id: number;
    public numeroDocumento: string;
    public razonSocial: string;
    public contacto: string;
    public departamento: string;
    public provincia: string;
    public distrito: string;
    public telefono: string;
    public direccion: string;
    public referencia: string;
    public envio: Envio;
    public resumen: string;
    
}