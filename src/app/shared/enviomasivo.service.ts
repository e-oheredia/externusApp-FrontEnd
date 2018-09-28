import { EnvioMasivo } from '../../model/enviomasivo.model';
import { AppSettings } from './app.settings';
import { Envio } from '../../model/envio.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from 'rxjs';


@Injectable()
export class EnvioMasivoService {

    constructor(private requester: RequesterService){}

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ENVIO_MASIVO_URL;

    registrarEnvioMasivo(envioMasivo: EnvioMasivo, file: File): Observable<EnvioMasivo> {
        let form: FormData = new FormData;
        form.append("envioMasivo", JSON.stringify(envioMasivo));
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<EnvioMasivo>(this.REQUEST_URL, form, {});
    }

    listarEnviosMasivosCreados(){
        return this.requester.get<Envio[]>(this.REQUEST_URL + "creados", {});
    }
    


}