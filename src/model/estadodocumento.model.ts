import { MotivoEstado } from "./motivoestado.model";
import { TipoDevolucion } from "./tipodevolucion.model";

export class EstadoDocumento {

    constructor(
        public id: number,
        public nombre: string
    ) { }

    public estadosDocumentoPermitidos: EstadoDocumento[];
    public motivos: MotivoEstado[];
    public tiposDevolucion: TipoDevolucion[];    
}