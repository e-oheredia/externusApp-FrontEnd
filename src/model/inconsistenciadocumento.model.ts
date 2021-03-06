import { Envio } from "./envio.model";

export class InconsistenciaDocumento {

    constructor() {
        this.resumen = "";
    }

    public id: number;
    public numeroDocumento: string;
    public razonSocial: string;
    public contacto: string;
    public departamento: string;
    public provincia: string;
    public distrito: string;
    public telefono: Date;
    public direccion: string;
    public referencia: string;
    public envio: Envio;
    public resumen: string;

}