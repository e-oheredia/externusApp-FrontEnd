import { Documento } from './documento.model';


export class DocumentoGuia {
    constructor(public id: number, public documento: Documento, public validado: boolean, public fechaAsociacion: Date){}
}