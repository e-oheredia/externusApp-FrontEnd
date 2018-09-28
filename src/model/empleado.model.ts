import { BuzonEmpleado } from "./buzonempleado.model";
import { PuestoEmpleado } from "./puestoempleado.model";

export class Empleado {
    constructor(public id: number, public nombres:string, public matricula: String, public buzones: BuzonEmpleado[], public puestoActual: PuestoEmpleado){}
}