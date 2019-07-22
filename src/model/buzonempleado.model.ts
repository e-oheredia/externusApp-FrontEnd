import { Buzon } from "./buzon.model";

export class BuzonEmpleado {

    constructor(
        public fechaAsociado: Date,
        public buzon: Buzon,
        public fechaDesacosiado: Date | Object
    ) { }
    
}