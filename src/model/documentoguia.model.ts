import { Documento } from './documento.model';
import { Guia } from './guia.model';


export class DocumentoGuia {
    constructor(
        public documento: Documento, 
        public guia: Guia,
        public validado: boolean, 
        public fechaAsociacion: Date
       ){}
}