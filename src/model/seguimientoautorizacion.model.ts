import { Envio } from "./envio.model";
import { EstadoAutorizacion } from "./estadoautorizacion.model";

export class SeguimientoAutorizacion {
    constructor(
        public id: number, 
        public envio:Envio, 
        public estadoAutorizado: EstadoAutorizacion, 
        public fecha: Date,
        public nombreUsuario: string
    ){}
}