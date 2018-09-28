import { Puesto } from "./puesto.model";

export class PuestoEmpleado {
    constructor(public puesto: Puesto, public fechaAsociado:Date, public fechaDesasociado: Date | Object){}
}