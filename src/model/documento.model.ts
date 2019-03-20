import { Distrito } from "./distrito.model";
import { SeguimientoDocumento } from "./seguimientodocumento.model";
import { Envio } from "./envio.model";
import { DocumentoGuia } from "./documentoguia.model";

export class Documento {


    constructor(){}
    
    public id: number;
    public contactoDestino: string; 
    public direccion: string; 
    public distrito: Distrito; 
    public documentoAutogenerado: string; 
    public nroDocumento: string;
    public razonSocialDestino: string;
    public recepcionado: boolean;
    public referencia: string;
    public telefono: string; 
    public envio: Envio;
    public seguimientosDocumento: SeguimientoDocumento[] = [];    
    public checked: boolean;   
    public documentosGuia: DocumentoGuia[] = [];  
    public codigoDevolucion: string;
}