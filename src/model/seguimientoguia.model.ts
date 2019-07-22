import { EstadoGuia } from './estadoguia.model';
import { Guia } from './guia.model';

export class SeguimientoGuia {

    constructor(
        public id: number,
        public guia: Guia,
        public estadoGuia: EstadoGuia,
        public fecha: Date
    ) { }

}