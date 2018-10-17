import { EstadoDocumento } from "./estadodocumento.model";

export class SeguimientoDocumento {
    constructor(){}

    public id: number; 
    public observacion:string; 
    public linkImagen: string; 
    public fecha: Date | string; 
    public estadoDocumento: EstadoDocumento;
}