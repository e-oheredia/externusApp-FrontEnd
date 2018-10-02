import { Documento } from './documento.model';


export class DocumentoGuia {
    constructor(public documento: Documento, public validado: boolean, public fechaAsociacion: Date){}
}