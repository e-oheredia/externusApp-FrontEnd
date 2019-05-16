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
import { MotivoEstado } from 'src/model/motivoestado.model';
import { Guia } from 'src/model/guia.model';
import { TipoDevolucion } from 'src/model/tipodevolucion.model';
import { TipoDevolucionEnum } from '../enum/tipodevolucion.enum';
import { MotivoEstadoEnum } from '../enum/motivoestado.enum';
import { WriteExcelService } from './write-excel.service';
import { Inconsistencia } from 'src/model/inconsistencia.model';
import { Envio } from 'src/model/envio.model';

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
        private estadoDocumentoService: EstadoDocumentoService,
        private buzonService: BuzonService,
        private writeExcelService: WriteExcelService
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
            let i = 1

            let envio: Envio = new Envio();
            let registrosCorrectos: Documento[] = []
            let registrosIncorrectos: Inconsistencia[] = []
            let distritocorrecto: Distrito;
            //LUEGO DEL 4TO REGISTRO NO DEBERIA VOLVER AL WHILE
            while (true) {

                console.log("ESTA ES LA DATA i : " + data[i]);

                if (this.utilsService.isUndefinedOrNull(data[i])) {
                    callback({
                        mensaje: "El formato está vacío "
                    });
                    return;
                }

                if (data[i].length === 0) {
                    break;
                }

                let documentoCargado: Documento = new Documento();
                let registroIncorrecto: Inconsistencia = new Inconsistencia();

                // VALIDACIONES
                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][0]) || this.utilsService.isUndefinedOrNullOrEmpty(data[i][1]) ||
                    this.utilsService.isUndefinedOrNullOrEmpty(data[i][2]) || this.utilsService.isUndefinedOrNullOrEmpty(data[i][3]) ||
                    this.utilsService.isUndefinedOrNullOrEmpty(data[i][4]) || this.utilsService.isUndefinedOrNullOrEmpty(data[i][5]) ||
                    this.utilsService.isUndefinedOrNullOrEmpty(data[i][6]) || this.utilsService.isUndefinedOrNullOrEmpty(data[i][7]) ||
                    this.utilsService.isUndefinedOrNullOrEmpty(data[i][8])) {

                    registroIncorrecto.numeroDocumento = data[i][0];
                    registroIncorrecto.razonSocial = data[i][1];
                    registroIncorrecto.contacto = data[i][2];
                    registroIncorrecto.departamento = data[i][3];
                    registroIncorrecto.provincia = data[i][4];
                    registroIncorrecto.distrito = data[i][5];
                    registroIncorrecto.telefono = data[i][6];
                    registroIncorrecto.direccion = data[i][7];
                    registroIncorrecto.referencia = data[i][8];
                    registrosIncorrectos.push(registroIncorrecto);

                } else {
                    //departamento
                    if (this.departamentoService.listarDepartamentoByNombre(data[i][3]) === null) {
                        registroIncorrecto.numeroDocumento = data[i][0];
                        registroIncorrecto.razonSocial = data[i][1];
                        registroIncorrecto.contacto = data[i][2];
                        registroIncorrecto.departamento = data[i][3];
                        registroIncorrecto.provincia = data[i][4];
                        registroIncorrecto.distrito = data[i][5];
                        registroIncorrecto.telefono = data[i][6];
                        registroIncorrecto.direccion = data[i][7];
                        registroIncorrecto.referencia = data[i][8];
                        registrosIncorrectos.push(registroIncorrecto);
                    } else {
                        //provincia
                        if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][4], data[i][3]) === null) {
                            registroIncorrecto.numeroDocumento = data[i][0];
                            registroIncorrecto.razonSocial = data[i][1];
                            registroIncorrecto.contacto = data[i][2];
                            registroIncorrecto.departamento = data[i][3];
                            registroIncorrecto.provincia = data[i][4];
                            registroIncorrecto.distrito = data[i][5];
                            registroIncorrecto.telefono = data[i][6];
                            registroIncorrecto.direccion = data[i][7];
                            registroIncorrecto.referencia = data[i][8];
                            registrosIncorrectos.push(registroIncorrecto);
                        } else {
                            //distrito
                            let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][5], data[i][4])
                            if (distrito === null) {
                                registroIncorrecto.numeroDocumento = data[i][0];
                                registroIncorrecto.razonSocial = data[i][1];
                                registroIncorrecto.contacto = data[i][2];
                                registroIncorrecto.departamento = data[i][3];
                                registroIncorrecto.provincia = data[i][4];
                                registroIncorrecto.distrito = data[i][5];
                                registroIncorrecto.telefono = data[i][6];
                                registroIncorrecto.direccion = data[i][7];
                                registroIncorrecto.referencia = data[i][8];
                                registrosIncorrectos.push(registroIncorrecto);
                            }
                            else {
                                documentoCargado.nroDocumento = data[i][0] || "";
                                documentoCargado.razonSocialDestino = data[i][1] || "";
                                documentoCargado.contactoDestino = data[i][2] || "";
                                documentoCargado.distrito = distrito;
                                documentoCargado.telefono = data[i][6] || "";
                                documentoCargado.direccion = data[i][7] || "";
                                documentoCargado.referencia = data[i][8] || "";
                                registrosCorrectos.push(documentoCargado);
                            }
                        }
                    }
                }
                i++;
            }

            envio.documentos = registrosCorrectos
            envio.inconsistencias = registrosIncorrectos;
            callback(envio);
            console.log("ESTE ES EL ENVIO RESPUESTA : " + envio);
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
        ) ? documento.seguimientosDocumento.find(seguimientoDocumento =>
            seguimientoDocumento.estadoDocumento.id === 3
        ).fecha : null;
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

    //REPORTE
    subirReporte(documentos: Documento[]): Observable<any> {
        return this.requesterService.put<any>(this.REQUEST_URL + "cargaresultado", documentos, {});
    }

    listarDocumentosEntregados(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "entregados", {});
    }

    listarDocumentosPorDevolver(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "pordevolver", {});
    }

    listarDocumentosUsuarioBCP(fechaini: Date, fechafin: Date): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "consultabcp", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('idbuzon', this.buzonService.getBuzonActual().id.toString()) });
    }

    listarDocumentosUtdBCPCodigo(codigo: string) {
        return this.requesterService.get<Documento>(this.REQUEST_URL + "consultautd", { params: new HttpParams().append('autogenerado', codigo.toString()) });
    }

    listarDocumentosUtdBCPFechas(fechaini: Date, fechafin: Date): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "consultautd", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    listarDocumentoPorCodigo(codigo: string) {
        return this.requesterService.get<Documento>(this.REQUEST_URL + "consultautd", { params: new HttpParams().append('autogenerado', codigo.toString()) });
    }

    cambiarEstado(codigo: number, seguimiento: SeguimientoDocumento) {
        return this.requesterService.post<Documento>(this.REQUEST_URL + codigo.toString() + "/cambioestado", seguimiento, {});
    }

    desvalidar(id: number) {
        return this.requesterService.put<DocumentoGuia>(this.REQUEST_URL + id + "/desvalidar", null, {});
    }

    listarDocumentosReportesVolumen(fechaini: Date, fechafin: Date, idestado: number): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentosvolumen", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()).append('estado', idestado.toString()) });
    }

    getSeguimientoDocumentoByEstadoId(documento: Documento, estadoId: number) {
        return documento.seguimientosDocumento.find(
            seguimientoDocumento => seguimientoDocumento.estadoDocumento.id === estadoId);
    }

    getUltimoSeguimientoDocumento(documento: Documento) {
        return documento.seguimientosDocumento.reduce(
            (max, seguimentoDocumento) =>
                moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        )
    }

    getUltimaFechaEstado(documento: Documento): Date | string {
        return documento.seguimientosDocumento.reduce(
            (max, seguimentoDocumento) =>
                moment(seguimentoDocumento.fecha, "DD-MM-YYYY HH:mm:ss") > moment(max.fecha, "DD-MM-YYYY HH:mm:ss") ? seguimentoDocumento : max, documento.seguimientosDocumento[0]
        ).fecha
    }

    recepcionarCargo(codigo: number): Observable<Documento> {
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo + "/recepcioncargo", {}, {});
    }

    recepcionarDocumento(codigo: number): Observable<Documento> {
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo + "/" + "recepciondevueltos", {}, {});
    }

    listarCargos(fechaini: Date, fechafin: Date): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentoscargos", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    asignarCodigoDevolucionCargo(id: number, codigo: string): Observable<Documento> {
        return this.requesterService.post<Documento>(this.REQUEST_URL + id + "/codigodevolucion", codigo, {});
    }

    validarResultadosDelProveedor(file: File, sheet: number, callback: Function) {

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
                    estadoDocumento => estadoDocumento.nombre === data[i][17]
                )

                if (this.utilsService.isUndefinedOrNullOrEmpty(estadoDocumento)) {
                    callback({
                        mensaje: "Ingrese Estado permitido en la fila " + (i + 1)
                    });
                    return;
                }

                let motivoEstado = estadoDocumento.motivos.find(motivo => motivo.nombre === data[i][18]);

                if (this.utilsService.isUndefinedOrNullOrEmpty(motivoEstado)) {
                    callback({
                        mensaje: "Ingrese motivo correcto en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.estadoDocumento = estadoDocumento;

                if ((estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO ||
                    estadoDocumento.id === EstadoDocumentoEnum.REZAGADO ||
                    estadoDocumento.id === EstadoDocumentoEnum.NO_DISTRIBUIBLE) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][18])) {
                    callback({
                        mensaje: "Ingrese el motivo del Estado en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.motivoEstado = motivoEstado;

                if ((estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO || estadoDocumento.id === EstadoDocumentoEnum.REZAGADO) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][19])) {
                    callback({
                        mensaje: "Ingrese Link del Entregado o Rezagado en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.linkImagen = data[i][19] || "";

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][20]) && this.utilsService.isValidDate(data[i][20])) {

                    callback({
                        mensaje: "Ingrese la fecha en el formato correcto en la fila " + (i + 1)
                    });
                    return;
                }

                seguimientoDocumento.fecha = moment(this.utilsService.getJsDateFromExcel(data[i][20])).tz("America/Lima").format('DD-MM-YYYY HH:mm:ss');

                documentoCargado.seguimientosDocumento.push(seguimientoDocumento);
                documentosCargados.push(documentoCargado);
                i++;
            }

            callback(documentosCargados);

        });
    }


    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------


    validarDevolucionesDelProveedor(file: File, sheet: number, callback: Function) {

        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let documentosDevueltos: Documento[] = [];
            let i = 1
            while (true) {
                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i])) {
                    break;
                }
                let documentoDevuelto = new Documento();

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                    callback({
                        mensaje: "Ingrese el autogenerado en la fila " + (i + 1)
                    });
                    return;
                }

                documentoDevuelto.documentoAutogenerado = data[i][1];

                //-------------------------------------------------------------------------------------------------------------------------------------

                let estadoDocumento = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor().find(
                    estadoDocumento => estadoDocumento.nombre === data[i][17]
                )

                let motivoDocumento = this.estadoDocumentoService.getMotivosEstadoDocumentoResultadosProveedor().find(
                    motivoDocumento => motivoDocumento.nombre === data[i][18]
                )

                let cargoDevuelto = data[i][19];
                let rezagoDevuelto = data[i][20];
                let denunciaDevuelta = data[i][21];
                let abc = data[i][18];

                //VALIDACIÓN DE LAS 3 DEVOLUCIONES VACÍAS
                if ((this.utilsService.isUndefinedOrNullOrEmpty(cargoDevuelto)) && (this.utilsService.isUndefinedOrNullOrEmpty(rezagoDevuelto)) && (this.utilsService.isUndefinedOrNullOrEmpty(denunciaDevuelta))) {
                    callback({
                        mensaje: "Ingrese una o más devoluciones en la fila " + (i + 1)
                    });
                    return;
                }

                if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][19])) {
                    if (data[i][19] == "x" || data[i][19] == "X") {
                        let tipodevolucion = new TipoDevolucion();
                        tipodevolucion.id = TipoDevolucionEnum.CARGO;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion)
                    } else {
                        callback({
                            mensaje: "El caracter ingresado en la columna cargo de la fila " + (i + 1) + ", no es una 'x'"
                        })
                        return;
                    }
                }


                if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][20])) {
                    if (data[i][20] == "x" || data[i][20] == "X") {
                        let tipodevolucion = new TipoDevolucion();
                        tipodevolucion.id = TipoDevolucionEnum.REZAGO;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion);
                    } else {
                        callback({
                            mensaje: "El caracter ingresado en la columna rezago de la fila " + (i + 1) + ", no es una 'x'"
                        })
                        return;
                    }
                }


                if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][21])) {
                    if (data[i][21] == "x" || data[i][21] == "X") {
                        let tipodevolucion = new TipoDevolucion();
                        tipodevolucion.id = TipoDevolucionEnum.DENUNCIA;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion)
                    } else {
                        callback({
                            mensaje: "El caracter ingresado en la columna denuncia de la fila " + (i + 1) + ", no es una 'x'"
                        })
                        return;
                    }
                }



                /* VALIDACIONES
                //EL ESTADO DEL DOCUMENTO ES ENTREGADO?
                if (estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO) {
                    // SI EL ENTREGADO TIENE LA DEVOLUCION CARGO VACÍA
                    if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][19])) {
                        callback({
                            mensaje: "Ingrese la devolución del Entregado en la fila " + (i + 1)
                        });
                        return;
                    }
                    if (data[i][19] == "x" || data[i][19] == "X" || data[i][20] == "x" || data[i][20] == "X" || data[i][21] == "x" || data[i][21] == "X") {
                        let tipodevolucion = new TipoDevolucion();
                        tipodevolucion.id = TipoDevolucionEnum.CARGO;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion)
                        console.log("CARGO DE ENTREGA RECIBIDO");
                    } else {
                        callback({
                            mensaje: "El caracter ingresado en la columna cargo de la fila " + (i + 1) + ", no es una 'x'"
                        })
                        return;
                    }
                }

                //EL ESTADO DEL DOCUMENTO ES REZAGADO?
                if (estadoDocumento.id === EstadoDocumentoEnum.REZAGADO) {
                    //SI EL REZAGADO TIENE LA DEVOLUCION CARGO O REZAGO VACÍA
                    if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][19]) || this.utilsService.isUndefinedOrNullOrEmpty(data[i][20])) {
                        callback({
                            mensaje: "Ingrese las 2 devoluciones del Rezagado en la fila " + (i + 1)
                        });
                        return;
                    }
                    if ((data[i][19] == "x" || data[i][19] == "X") && (data[i][20] == "x" || data[i][20] == "X")) {
                        let tipodevolucion = new TipoDevolucion();
                        tipodevolucion.id = TipoDevolucionEnum.REZAGO;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion);
                        let tipodevolucion2 = new TipoDevolucion();
                        tipodevolucion2.id = TipoDevolucionEnum.CARGO;
                        documentoDevuelto.tiposDevolucion.push(tipodevolucion2)
                        console.log("CARGO DE REZAGO RECIBIDO");
                    } else {
                        callback({
                            mensaje: "El caracter ingresado en la columna cargo de la fila " + (i + 1) + ", no es una 'x'"
                        })
                        return;
                    }
                }

                //EL ESTADO DEL DOCUMENTO ES NO_DISTRIBUIBLE?
                if (estadoDocumento.id === EstadoDocumentoEnum.NO_DISTRIBUIBLE) {
                    //EL MOTIVO DEL DOCUMENTO ES EXTRAVIADO_ROBADO?
                    if (motivoDocumento.id === MotivoEstadoEnum.EXTRAVIADO_O_ROBADO) {
                        //SI EL NO_DISTRIBUIBLE TIENE LA DEVOLUCION DENUNCIA VACÍA
                        if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][21])) {
                            callback({
                                mensaje: "Ingrese la devolución del No Distribuible en la fila " + (i + 1)
                            });
                            return;
                        }
                        //SI LA DEVOLUCION TIENE UNA "X" o "x"
                        if (data[i][19] == "x" || data[i][19] == "X" || data[i][20] == "x" || data[i][20] == "X" || data[i][21] == "x" || data[i][21] == "X") {
                            let tipodevolucion = new TipoDevolucion();
                            tipodevolucion.id = TipoDevolucionEnum.DENUNCIA;
                            documentoDevuelto.tiposDevolucion.push(tipodevolucion)
                            console.log("CARGO DE NO_DISTRIBUIBLE RECIBIDO");
                        } else {
                            callback({
                                mensaje: "El caracter ingresado en la columna cargo de la fila " + (i + 1) + ", no es una 'x'"
                            })
                            return;
                        }
                    }
                }
                */

                //-------------------------------------------------------------------------------------------------------------------------------------

                documentosDevueltos.push(documentoDevuelto);
                i++;
            }

            callback(documentosDevueltos);

        });
    }


    exportarDocumentos(documentos) {
        let objects = [];
        documentos.forEach(documento => {
            objects.push({
                "Autogenerado": documento.documentoAutogenerado,
                "Remitente": documento.envio.buzon.nombre,
                "Producto": documento.envio.producto.nombre,
                "Plazo de distribución": documento.envio.plazoDistribucion.nombre ? documento.envio.plazoDistribucion.nombre : "no tiene",
                "Razón social": documento.razonSocialDestino ? documento.razonSocialDestino : "no tiene",
                "Contacto": documento.contactoDestino ? documento.contactoDestino : "no tiene",
                "Dirección": documento.direccion,
                "Distrito": documento.distrito.nombre,
                "Clasificación": documento.envio.clasificacion ? documento.envio.clasificacion.nombre : "no tiene",
                "Estado del documento": this.getUltimoEstado(documento).nombre,
                "Motivo": this.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : "",
                "Estado del cargo": ' ',
                "Físico recibido": documento.recepcionado ? "SI" : "NO",
                "Autorizado": documento.envio.autorizado ? "SI" : "NO",
                "Fecha de creación": this.getFechaCreacion(documento),
                "Fecha de envío": this.getFechaCreacion(documento),
                "Fecha último resultado": this.getUltimaFechaEstado(documento),
                "Código  de devolución": documento.codigoDevolucion
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Permisos de plazos por Áreas: ");
    }




}


