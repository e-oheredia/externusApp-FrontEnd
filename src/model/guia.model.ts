import { DocumentoGuia } from './documentoguia.model';
import { TipoSeguridad } from './tiposeguridad.model';
import { TipoServicio } from './tiposervicio.model';
import { PlazoDistribucion } from './plazodistribucion.model';
import { Proveedor } from './proveedor.model';
export class Guia {
    constructor(
        public id: number, 
        public numeroGuia:string, 
        public plazoDistribucion: PlazoDistribucion, 
        public tipoServicio: TipoServicio, 
        public tipoSeguridad: TipoSeguridad, 
        public proveedor: Proveedor, 
        public documentosGuia: DocumentoGuia[]
    ){}
}