import { Subject } from 'rxjs';
import { EstadoDocumento } from './../../model/estadodocumento.model';
import { Observable } from 'rxjs';
import { RequesterService } from './requester.service';
import { Injectable } from '@angular/core';
import { AppSettings } from './app.settings';
import { TipoEstadoDocumentoEnum } from '../enum/tipoestadodocumento.enum';


@Injectable()
export class EstadoDocumentoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ESTADO_DOCUMENTO_URL;
    TIPO_ESTADO_DOCUMENTO_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_ESTADO_DOCUMENTO_URL;

    estadosDocumentoResultadosProveedor: EstadoDocumento[] = [];
    estadosDocumentoResultadosProveedorChanged: Subject<EstadoDocumento[]> = new Subject<EstadoDocumento[]>();
    constructor(
        private requesterService: RequesterService
    ) {
        this.listarEstadosDocumentoByTipoEstadoDocumentoId(TipoEstadoDocumentoEnum.RESULTADOS_PROVEEDOR).subscribe(
            estadosDocumento => {
                this.estadosDocumentoResultadosProveedor = estadosDocumento
                this.estadosDocumentoResultadosProveedorChanged.next(this.getEstadosDocumentoResultadosProveedor());
            }
        )
    }

    getEstadosDocumentoResultadosProveedor() {
        return this.estadosDocumentoResultadosProveedor;
    }

    listarEstadosDocumentoByTipoEstadoDocumentoId(tipoEstadoDocumentoId: number): Observable<EstadoDocumento[]> {
        return this.requesterService.get<EstadoDocumento[]>(this.TIPO_ESTADO_DOCUMENTO_REQUEST_URL + tipoEstadoDocumentoId.toString() + "/" + AppSettings.ESTADO_DOCUMENTO_URL, {});
    }





}