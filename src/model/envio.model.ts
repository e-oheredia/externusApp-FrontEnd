import { Documento } from './documento.model';
import { Buzon } from "./buzon.model";
import { PlazoDistribucion } from "./plazodistribucion.model";
import { TipoServicio } from "./tiposervicio.model";
import { TipoSeguridad } from "./tiposeguridad.model";
import { TipoDocumento } from "./tipodocumento.model";
import { TipoSede } from './tiposede.model';

export class Envio {

    constructor(){
        this.documentos = [];
    }

    public id: number; 
    public buzon:Buzon; 
    public autorizacion: File; 
    public rutaAutorizacion: string; 
    public plazoDistribucion: PlazoDistribucion; 
    public tipoServicio: TipoServicio; 
    public tipoSeguridad: TipoSeguridad; 
    public tipoDocumento: TipoDocumento; 
    public sede: TipoSede; 
    public documentos: Documento[];
    public checked: boolean;
    public autorizado: boolean;

    public addDocumento(documento: Documento){
        this.documentos.push(documento);
    }
}