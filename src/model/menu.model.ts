import { Opcion } from './opcion.model';

export class Menu {

    constructor(
        public id: number,
        public nombre: string,
        public hijosMenu: Menu[],
        public claseIcono: string,
        public activo: boolean,
        public opcion: Opcion
    ) { }

}