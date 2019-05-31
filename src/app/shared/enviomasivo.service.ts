import { EnvioMasivo } from '../../model/enviomasivo.model';
import { AppSettings } from './app.settings';
import { Envio } from '../../model/envio.model';
import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { SeguimientoAutorizacion } from 'src/model/seguimientoautorizacion.model';


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
        return this.requester.get<EnvioMasivo[]>(this.REQUEST_URL + "creados", {});
    }
    
    getUltimoSeguimientoAutorizacion(envio: EnvioMasivo): SeguimientoAutorizacion {
        return envio.seguimientosAutorizado.reduce(
            (max, seguimentoAutorizado) =>
                moment(seguimentoAutorizado.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoAutorizado : max, envio.seguimientosAutorizado[0]
        );

        
    }


}