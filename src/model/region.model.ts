import { DiaLaborable } from "./dialaborable.model";
import { PlazoDistribucion } from "./plazodistribucion.model";

export class Region {

    constructor() { }

    public id: number;
    public nombre: string;
    public diasLaborables: DiaLaborable[];
    public plazosDistribucion: PlazoDistribucion[];
}