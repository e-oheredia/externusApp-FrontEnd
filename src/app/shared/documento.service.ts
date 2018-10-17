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
import {  Subscription, Observable } from "rxjs";
import { Provincia } from '../../model/provincia.model';
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';
import { SeguimientoDocumento } from 'src/model/seguimientodocumento.model';
import { BuzonService } from './buzon.service';

@Injectable()
export class DocumentoService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.DOCUMENTO_URL;

    constructor(
        private readExcelService: ReadExcelService,
        private departamentoService: DepartamentoService, 
        private provinciaService: ProvinciaService,
        private distritoService: DistritoService, 
        private utilsService: UtilsService, 
        private requesterService: RequesterService,
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
                        mensaje : "Ingrese la razón social o el contacto en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.razonSocialDestino = data[i][1] || "";
                documentoCargado.contactoDestino = data[i][2] || "";

                if (this.departamentoService.listarDepartamentoByNombre(data[i][3]) === null) {
                    callback({
                        mensaje : "Ingrese Departamento válido en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][4], data[i][3]) === null) {
                    callback({
                        mensaje : "Ingrese Provincia válida en la fila " + (i + 1)
                    });
                    return;
                }

                let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][5], data[i][4])

                if (distrito === null){
                    callback({
                        mensaje : "Ingrese Distrito válido en la fila " + (i + 1)
                    });
                    return;
                }

                documentoCargado.distrito = distrito;
                documentoCargado.telefono = data[i][6] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][7])) {
                    callback({
                        mensaje : "Ingrese la dirección en la fila " + (i + 1)
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

    getFechaCreacion(documento: Documento): Date{
        return documento.seguimientosDocumento.find(seguimientoDocumento => 
            seguimientoDocumento.estadoDocumento.id === 1
        ).fecha;
    }

    getUltimoEstado(documento: Documento): EstadoDocumento{
        let estadoDocumento =  documento.seguimientosDocumento.reduce(
            (max,seguimentoDocumento) => 
            moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        ).estadoDocumento;

        return estadoDocumento;
    }

    custodiarDocumentos(documentos: Documento[]): Observable<Documento[]>{
        return this.requesterService.put<Documento[]>(this.REQUEST_URL + "custodia",documentos,{});
    }

    listarDocumentosCustodiados(): Observable<Documento[]>{
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "custodiados",{});
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

    recepcionarCargo(codigo: number): Observable<Documento>{
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo +  "/recepcioncargo", {}, {});
    }

    recepcionarDocumento(codigo: number): Observable<Documento>{
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo + "/" + "recepciondevueltos", {}, {});
    }

}