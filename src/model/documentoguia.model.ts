import { Documento } from './documento.model';
import { Guia } from './guia.model';


export class DocumentoGuia {
    constructor(public documento: Documento, public validado: boolean, public fechaAsociacion: Date, public guia: Guia){}
}