import { Envio } from "./envio.model";

export class InconsistenciaResultado {

    constructor() {
        this.resumen = "";
    }

    public guia: number;
    public autogenerado: string;
    public guiaautogenerado: string;
    public sede: string;
    public plazo: string;
    public seguridad: string;
    public servicio: string;
    public clasificacion: string;
    public producto: string;
    public razonsocial: string;
    public contacto: string;
    public departamento: string;
    public provincia: string;
    public distrito: string;
    public direccion: string;
    public referencia: string;
    public telefono: string;
    public estado: string;
    public motivo: string;
    public link: string;
    public fecharesultado: Date;
    public envio: Envio;
    public resumen: string;

}