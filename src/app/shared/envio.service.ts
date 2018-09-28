import { AppSettings } from './app.settings';
import { Envio } from '../../model/envio.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from 'rxjs';


@Injectable()
export class EnvioService {

    constructor(private requester: RequesterService) { }

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ENVIO_URL;

    registrarEnvio(envio: Envio, file: File): Observable<Envio> {
        let form: FormData = new FormData;
        form.append("envio", JSON.stringify(envio));
        if (file !== null && file != undefined) {
            form.append("file", file);
        }
        return this.requester.post<Envio>(this.REQUEST_URL, form, {});
    }

    listarEnviosIndividualesCreados() {
        return this.requester.get<Envio[]>(this.REQUEST_URL + "creados", {});
    }

    listarEnviosNoAutorizados(): Observable<Envio[]> {
        return this.requester.get<Envio[]>(this.REQUEST_URL + "noautorizados", {});
    }

    autorizarEnvio(id: number): Observable<Envio> {
        return this.requester.put<Envio>(this.REQUEST_URL + id.toString() + "/autorizacion", {}, {});
    }

    denegarEnvio(id: number): Observable<Envio> {
        return this.requester.put<Envio>(this.REQUEST_URL + id.toString() + "/denegacion", {}, {});
    }


}