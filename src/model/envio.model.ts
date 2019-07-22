import { Documento } from './documento.model';
import { Buzon } from "./buzon.model";
import { PlazoDistribucion } from "./plazodistribucion.model";
import { TipoServicio } from "./tiposervicio.model";
import { TipoSeguridad } from "./tiposeguridad.model";
import { Sede } from './sede.model';
import { Producto } from './producto.model';
import { Clasificacion } from './clasificacion.model';
import { TipoEnvio } from './tipoenvio.model';
import { SeguimientoAutorizacion } from './seguimientoautorizacion.model';
import { InconsistenciaDocumento } from './inconsistenciadocumento.model';
import { InconsistenciaResultado } from './inconsistenciaresultado.model';

export class Envio {

    constructor() {
        this.documentos = [];
    }

    public id: number;
    public buzon: Buzon;
    public autorizacion: File;
    public rutaAutorizacion: string;
    public plazoDistribucion: PlazoDistribucion;
    public producto: Producto;
    public tipoServicio: TipoServicio;
    public tipoSeguridad: TipoSeguridad;
    public clasificacion: Clasificacion;
    public sede: Sede;
    public documentos: Documento[];
    public checked: boolean;
    public autorizado: boolean;
    public autogenerado: string;
    public tipoEnvio: TipoEnvio;
    public seguimientosAutorizado: SeguimientoAutorizacion[] = [];
    public inconsistenciasDocumento: InconsistenciaDocumento[] = [];
    public inconsistenciasResultado: InconsistenciaResultado[] = [];

    public addDocumento(documento: Documento) {
        this.documentos.push(documento);
    }
    
}