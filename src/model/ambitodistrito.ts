import { Ambito } from "./ambito.model";
import { Distrito } from "./distrito.model";

export class AmbitoDistrito {

    constructor(
        public ambito: Ambito,
        public distrito: Distrito
    ) { }

}