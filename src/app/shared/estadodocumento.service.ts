import { Subject } from 'rxjs';
import { EstadoDocumento } from './../../model/estadodocumento.model';
import { Observable } from 'rxjs';
import { RequesterService } from './requester.service';
import { Injectable } from '@angular/core';
import { AppSettings } from './app.settings';
import { TipoEstadoDocumentoEnum } from '../enum/tipoestadodocumento.enum';
import { MotivoEstado } from 'src/model/motivoestado.model';


@Injectable()
export class EstadoDocumentoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.ESTADO_DOCUMENTO_URL;
    TIPO_ESTADO_DOCUMENTO_REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.TIPO_ESTADO_DOCUMENTO_URL;
    
    constructor(private requesterService: RequesterService) {
        this.listarEstadosDocumento().subscribe(
            estadosDocumento => {
                this.estadosDocumento = estadosDocumento;
                this.estadosDocumentoChanged.next(this.estadosDocumento);
            }
        )
        this.listarEstadosDocumentoByTipoEstadoDocumentoId(TipoEstadoDocumentoEnum.RESULTADOS_PROVEEDOR).subscribe(
            estadosDocumento => {
                this.estadosDocumentoResultadosProveedor = estadosDocumento
                this.estadosDocumentoResultadosProveedorChanged.next(this.getEstadosDocumentoResultadosProveedor());
            }
        )
        this.listarMotivosEstadoDocumentoByTipoEstadoDocumentoId(TipoEstadoDocumentoEnum.RESULTADOS_PROVEEDOR).subscribe(
            motivosEstadoDocumento => {
                this.motivosEstadoDocumentoResultadosProveedor = motivosEstadoDocumento
                this.motivosEstadoDocumentoResultadosProveedorChanged.next(this.getMotivosEstadoDocumentoResultadosProveedor());
            }
        )
    }

    estadosDocumentoResultadosProveedor: EstadoDocumento[] = [];
    estadosDocumentoResultadosProveedorChanged: Subject<EstadoDocumento[]> = new Subject<EstadoDocumento[]>();
    motivosEstadoDocumentoResultadosProveedor: MotivoEstado[] = [];
    motivosEstadoDocumentoResultadosProveedorChanged: Subject<MotivoEstado[]> = new Subject<MotivoEstado[]>();
    estadosDocumento: EstadoDocumento[] = [];
    estadosDocumentoChanged = new Subject<EstadoDocumento[]>();


    public getEstadosDocumento(): EstadoDocumento[] {
        return this.estadosDocumento;
    }

    listarEstadosDocumento(): Observable<EstadoDocumento[]>{
        return this.requesterService.get<EstadoDocumento[]>(this.REQUEST_URL, {});
    }

    getEstadosDocumentoResultadosProveedor() {
        return this.estadosDocumentoResultadosProveedor;
    }

    getMotivosEstadoDocumentoResultadosProveedor() {
        return this.motivosEstadoDocumentoResultadosProveedor;
    }

    listarEstadosDocumentoByTipoEstadoDocumentoId(tipoEstadoDocumentoId: number): Observable<EstadoDocumento[]> {
        return this.requesterService.get<EstadoDocumento[]>(this.TIPO_ESTADO_DOCUMENTO_REQUEST_URL + tipoEstadoDocumentoId.toString() + "/" + AppSettings.ESTADO_DOCUMENTO_URL, {});
    }

    listarMotivosEstadoDocumentoByTipoEstadoDocumentoId(tipoEstadoDocumentoId: number): Observable<EstadoDocumento[]> {
        return this.requesterService.get<EstadoDocumento[]>(this.TIPO_ESTADO_DOCUMENTO_REQUEST_URL + tipoEstadoDocumentoId.toString() + "/" + AppSettings.MOTIVO_ESTADO_DOCUMENTO_URL, {});
    }



}