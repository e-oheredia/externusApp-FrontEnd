import { Distrito } from "./distrito.model";
import { SeguimientoDocumento } from "./seguimientodocumento.model";
import { Envio } from "./envio.model";
import { DocumentoGuia } from "./documentoguia.model";

export class Documento {


    constructor(){}
    
    public id: number;
    public documentoAutogenerado: string; 
    public distrito: Distrito; 
    public razonSocialDestino: string;
    public contactoDestino: string; 
    public direccion: string; 
    public referencia: string; 
    public telefono: string; 
    public nroDocumento: string;
    public seguimientosDocumento: SeguimientoDocumento[] = [];    
    public envio: Envio;
    public checked: boolean;   
    public recepcionado: boolean;
    public documentosGuia: DocumentoGuia[] = [];  

}