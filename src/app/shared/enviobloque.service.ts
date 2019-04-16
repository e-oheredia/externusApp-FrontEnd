import { AppSettings } from './app.settings';
import { Envio } from '../../model/envio.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from 'rxjs';
import { EnvioBloque } from 'src/model/enviobloque.model';
import { Guia } from 'src/model/guia.model';
import { Proveedor } from 'src/model/proveedor.model';


@Injectable()
export class EnvioBloqueService {

    constructor(private requester: RequesterService){}

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ENVIO_BLOQUE_URL;

    // registrarEnvioBloque(envioBloque: EnvioBloque, codigoGuia: number, proveedor: number): Observable<EnvioBloque> {
    //     let form: FormData = new FormData;
    //     form.append("envioBloque", JSON.stringify(envioBloque));
    //     return this.requester.post<EnvioBloque>(this.REQUEST_URL, form, {});
    // }

    // listarEnviosBloqueCreados(){
    //     return this.requester.get<Envio[]>(this.REQUEST_URL + "creados", {});
    // }
    


}