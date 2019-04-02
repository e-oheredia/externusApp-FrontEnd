import { MotivoEstado } from "./motivoestado.model";

export class EstadoDocumento {

    constructor(
        public id: number,
        public nombre: string
    ) { }

    public estadosDocumentoPermitidos: EstadoDocumento[];
    public motivos: MotivoEstado[];
}