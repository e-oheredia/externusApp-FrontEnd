import { SeguimientoGuia } from './seguimientoguia.model';
import { DocumentoGuia } from './documentoguia.model';
import { TipoSeguridad } from './tiposeguridad.model';
import { TipoServicio } from './tiposervicio.model';
import { PlazoDistribucion } from './plazodistribucion.model';
import { Proveedor } from './proveedor.model';
import { Sede } from './sede.model';
import { TipoGuia } from './tipoguia.model';
import { Producto } from './producto.model';
import { Clasificacion } from './clasificacion.model';
import { Region } from './region.model';

export class Guia {

    constructor(
        public id: number,
        public numeroGuia: string,
        public plazoDistribucion: PlazoDistribucion,
        public tipoServicio: TipoServicio,
        public tipoSeguridad: TipoSeguridad,
        public proveedor: Proveedor,
        public documentosGuia: DocumentoGuia[],
        public seguimientosGuia: SeguimientoGuia[],
        public sede: Sede,
        public cantidadDocumentos: number,
        public cantidadDocumentosPendientes: number,
        public tipoGuia: TipoGuia,
        public producto: Producto,
        public clasificacion: Clasificacion,
        public cantidadEntregados: number,
        public cantidadRezagados: number,
        public cantidadNoDistribuibles: number,
        public cantidadPendientes: number,
        public cantidadValidados: number,
        public fechaLimite: Date,
        public region: Region
    ) { }

}