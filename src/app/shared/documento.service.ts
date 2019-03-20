import { SeguimientoDocumento } from './../../model/seguimientodocumento.model';
import { EstadoDocumentoService } from './estadodocumento.service';
import { EstadoDocumento } from '../../model/estadodocumento.model';
import { RequesterService } from './requester.service';
import { UtilsService } from './utils.service';
import { Distrito } from '../../model/distrito.model';
import { Departamento } from '../../model/departamento.model';
import { ProvinciaService } from './provincia.service';
import { DistritoService } from './distrito.service';
import { DepartamentoService } from './departamento.service';
import { Documento } from '../../model/documento.model';
import { ReadExcelService } from './read-excel.service';
import { Injectable } from "@angular/core";
import { AppSettings } from "./app.settings";
import { Subscription, Observable } from "rxjs";
import { Provincia } from '../../model/provincia.model';
import * as moment from 'moment-timezone';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { HttpParams } from '@angular/common/http';
import { BuzonService } from './buzon.service';
import { Proveedor } from '../../model/proveedor.model';
import { DocumentoGuia } from 'src/model/documentoguia.model';

@Injectable()
export class DocumentoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DOCUMENTO_URL;
    GUIA_URL = AppSettings.API_ENDPOINT + AppSettings.GUIA_URL;

    constructor(
        private readExcelService: ReadExcelService,
        private departamentoService: DepartamentoService,
        private provinciaService: ProvinciaService,
        private distritoService: DistritoService,
        private utilsService: UtilsService,
        private requesterService: RequesterService,
        private estadoDocumentoService: EstadoDocumentoService,
        private buzonService: BuzonService
    ) {
        this.departamentosPeruSubscription = this.departamentoService.departamentosPeruChanged.subscribe(
            departamentosPeru => {
                this.departamentosPeru = departamentosPeru;
            }
        )
        this.provinciasSubscription = this.provinciaService.provinciasChanged.subscribe(
            provincias => {
                this.provincias = provincias;
            }
        )
        this.distritosSubscription = this.distritoService.distritosChanged.subscribe(
            distritos => {
                this.distritos = distritos;
            }
        )
    }

    documentos = [];
    departamentosPeru: Departamento[];
    provincias: Provincia[];
    distritos: Distrito[];

    departamentosPeruSubscription: Subscription;
    provinciasSubscription: Subscription;
    distritosSubscription: Subscription;

    mostrarDocumentosCargados(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let documentosCargados: Documento[] = [];
            let i = 1
            while (true) {

                if (data[i].length === 0) {
                    break;
                }
                let documentoCargado: Documento = new Documento();
                documentoCargado.nroDocumento = data[i][0] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1]) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][2])) {
                    callback({
                        mensaje: "Ingrese la razón social o el contacto en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.razonSocialDestino = data[i][1] || "";
                documentoCargado.contactoDestino = data[i][2] || "";

                if (this.departamentoService.listarDepartamentoByNombre(data[i][3]) === null) {
                    callback({
                        mensaje: "Ingrese Departamento válido en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][4], data[i][3]) === null) {
                    callback({
                        mensaje: "Ingrese Provincia válida en la fila " + (i + 1)
                    });
                    return;
                }

                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][5], data[i][4])

                if (distrito === null) {
                    callback({
                        mensaje: "Ingrese Distrito válido en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.distrito = distrito;
                documentoCargado.telefono = data[i][6] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][7])) {
                    callback({
                        mensaje: "Ingrese la dirección en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.direccion = data[i][7];
                documentoCargado.referencia = data[i][8] || "";
                documentosCargados.push(documentoCargado);
                i++;
            }

            callback(documentosCargados);

        });
    }

    getFechaCreacion(documento: Documento): Date | string {
        return documento.seguimientosDocumento.find(seguimientoDocumento =>
            seguimientoDocumento.estadoDocumento.id === 1
        ).fecha;
    }

    getFechaEnvio(documento: Documento): Date | string {
        return documento.seguimientosDocumento.find(seguimientoDocumento =>
            seguimientoDocumento.estadoDocumento.id === 3
        ).fecha;
    }

    getUltimoEstado(documento: Documento): EstadoDocumento {
        let estadoDocumento = documento.seguimientosDocumento.reduce(
            (max, seguimentoDocumento) =>
                moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        ).estadoDocumento;

        return estadoDocumento;
    }

    
    custodiarDocumentos(documentos: Documento[]): Observable<Documento[]> {
        return this.requesterService.put<Documento[]>(this.REQUEST_URL + "custodia", documentos, {});
    }

    listarDocumentosCustodiados(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "custodiados", {});
    }

    mostrarResultadosDocumentosProveedor(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let documentosCargados: Documento[] = [];
            let i = 1
            while (true) {
                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i])) {
                    break;
                }
                let documentoCargado = new Documento();
                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                    callback({
                        mensaje: "Ingrese el autogenerado en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.documentoAutogenerado = data[i][1];

                let seguimientoDocumento = new SeguimientoDocumento;

                let estadoDocumento = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor().find(
                    estadoDocumento => estadoDocumento.nombre === data[i][16]
                )

                if (estadoDocumento === null) {
                    callback({
                        mensaje: "Ingrese Estado permitido en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.estadoDocumento = estadoDocumento;

                if (estadoDocumento.id === EstadoDocumentoEnum.REZAGADO && this.utilsService.isUndefinedOrNullOrEmpty(data[i][17])) {
                    callback({
                        mensaje: "Ingrese Observación del Rezagado en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.observacion = data[i][17] || "";

                if ((estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO || estadoDocumento.id === EstadoDocumentoEnum.REZAGADO )  && this.utilsService.isUndefinedOrNullOrEmpty(data[i][18])) {
                    callback({
                        mensaje: "Ingrese Link del Entregado o Rezagado en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.linkImagen = data[i][18] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][19]) && this.utilsService.isValidDate(data[i][19])) {                   

                    callback({
                        mensaje: "Ingrese la fecha en el formato correcto en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.fecha = moment(this.utilsService.getJsDateFromExcel(data[i][19])).tz("America/Lima").format('DD-MM-YYYY HH:mm:ss');

                documentoCargado.seguimientosDocumento.push(seguimientoDocumento);
                documentosCargados.push(documentoCargado);
                i++;
            }

            callback(documentosCargados);

        });
    }

    codigoAutogenerado(id: number, prefijo: String) {

        let autogenerado: String;
        let longitud: number = 7;
        var length = id.toString().length;
        var cero = "0";
        autogenerado = prefijo + cero.repeat(longitud - length) + id.toString();
        return autogenerado;
    }

    actualizarResultadosProveedor(documentos: Documento[]): Observable<any> {
        return this.requesterService.put<any>(this.REQUEST_URL + "cargaresultado", documentos, {});
    }

    listarDocumentosEntregados(): Observable<Documento[]>{
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "entregados" ,{});
    }

    listarDocumentosPorDevolver(): Observable<Documento[]>{
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "pordevolver" ,{});
    }
    
    listarDocumentosUsuarioBCP(fechaini: Date, fechafin: Date): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "consultabcp" , { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('idbuzon', this.buzonService.getBuzonActual().id.toString()) });
    }

    listarDocumentosUtdBCPCodigo(codigo: string){
        return this.requesterService.get<Documento>(this.REQUEST_URL + "consultautd" , { params: new HttpParams().append('autogenerado', codigo.toString())});
    }

    listarDocumentosUtdBCPFechas(fechaini: Date, fechafin: Date){
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "consultautd" , { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    listarDocumentoPorCodigo(codigo: string){
        return this.requesterService.get<Documento>(this.REQUEST_URL + "consultautd", { params: new HttpParams().append('autogenerado', codigo.toString())});
    }



    cambiarEstado(codigo: number, seguimiento: SeguimientoDocumento){
        return this.requesterService.post<Documento>(this.REQUEST_URL + codigo.toString() + "/cambioestado" , seguimiento, {});
    }

    desvalidar(id: number){
        return this.requesterService.put<DocumentoGuia>(this.GUIA_URL + id + "/desvalidar", null ,{});
    }


    listarDocumentosReportesVolumen(fechaini: Date, fechafin: Date, idestado: number): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentosvolumen", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('estado', idestado.toString()) });
    }

    getSeguimientoDocumentoByEstadoId(documento: Documento, estadoId: number){
        return documento.seguimientosDocumento.find(
            seguimientoDocumento => seguimientoDocumento.estadoDocumento.id === estadoId);
    }

    getUltimoSeguimientoDocumento(documento: Documento){
        return documento.seguimientosDocumento.reduce(
            (max,seguimentoDocumento) => 
            moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        )
    }

    getUltimaFechaEstado(documento: Documento): Date | string {
        return documento.seguimientosDocumento.reduce(
            (max, seguimentoDocumento) =>
            moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        ).fecha
    }

    // extraerIdAutogenerado(autogenerado: String) {
    //     return parseInt(autogenerado.substring(1, 10));
    // }

    recepcionarCargo(codigo: number): Observable<Documento>{
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo +  "/recepcioncargo", {}, {});
    }

    recepcionarDocumento(codigo: number): Observable<Documento>{
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo + "/" + "recepciondevueltos", {}, {});
    }

    listarCargos(fechaini: Date, fechafin: Date): Observable<Documento[]>{
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentoscargos", {params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString())});
    }

    asignarCodigoDevolucionCargo(id: number, codigo: string): Observable<Documento>{
        return this.requesterService.post<Documento>(this.REQUEST_URL + id + "/codigodevolucion", codigo, {});
    }
}