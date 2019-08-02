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
import { HttpParams, HttpClient } from '@angular/common/http';
import { BuzonService } from './buzon.service';
import { DocumentoGuia } from 'src/model/documentoguia.model';
import { MotivoEstado } from 'src/model/motivoestado.model';
import { TipoDevolucion } from 'src/model/tipodevolucion.model';
import { TipoDevolucionEnum } from '../enum/tipodevolucion.enum';
import { WriteExcelService } from './write-excel.service';
import { InconsistenciaDocumento } from 'src/model/inconsistenciadocumento.model';
import { Envio } from 'src/model/envio.model';
import { InconsistenciaResultado } from 'src/model/inconsistenciaresultado.model';

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
        private writeExcelService: WriteExcelService,
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
    util : UtilsService;
    departamentosPeruSubscription: Subscription;
    provinciasSubscription: Subscription;
    distritosSubscription: Subscription;

    validarDocumentosMasivosYBloque(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let i = 1
            let envio: Envio = new Envio();
            let registrosCorrectos: Documento[] = []
            let registrosIncorrectos: InconsistenciaDocumento[] = []

            while (true) {

                if (this.utilsService.isUndefinedOrNull(data[i])) {
                    if (i === 1) {
                        callback({
                            mensaje: "El formato está vacío "
                        });
                        return;
                    } else {
                        break;
                    }
                }

                if (data[i].length === 0) {
                    break;
                }

                let todoCorrecto: boolean = true;

                let documentoCorrecto: Documento = new Documento();
                let documentoIncorrecto: InconsistenciaDocumento = new InconsistenciaDocumento();

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1]) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][2])) {
                    documentoIncorrecto.resumen += "Ingrese la razón social o el contacto. "
                    todoCorrecto = false;
                } else {
                    let razonsocial = data[i][1];
                    let contacto = data[i][2];
                    if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                        if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][2])) {
                            if (contacto.length < 4 || razonsocial.length < 4) {
                                documentoIncorrecto.resumen += "La razón social o el contacto deben tener más de 3 caracteres. "
                                todoCorrecto = false;
                            }

                        }
                    }

                    if (this.utilsService.isUndefinedOrNullOrEmpty(razonsocial)) {
                        if (contacto.length < 4) {
                            documentoIncorrecto.resumen += "La razón social o el contacto deben tener más de 3 caracteres. "
                            todoCorrecto = false;
                        }
                    }

                    if (this.utilsService.isUndefinedOrNullOrEmpty(contacto)) {
                        if (razonsocial.length < 4) {
                            documentoIncorrecto.resumen += "La razón social o el contacto deben tener más de 3 caracteres. "
                            todoCorrecto = false;
                        }
                    }

                }

                if (this.departamentoService.listarDepartamentoByNombre(data[i][3]) === null) {
                    documentoIncorrecto.resumen += "Ingrese Departamento válido (Es posible que la provincia y el distrito estén incorrectos). "
                    todoCorrecto = false;
                } else {
                    if (this.provinciaService.listarProvinciaByNombreProvinciaAndNombreDepartamento(data[i][4], data[i][3]) === null) {
                        documentoIncorrecto.resumen += "Ingrese Provincia válida (Es posible que el distrito esté incorrecto). "
                        todoCorrecto = false;
                    } else {
                        let distrito = this.distritoService.listarDistritoByNombreDistritoAndNombreProvincia(data[i][5], data[i][4])

                        if (distrito === null) {
                            documentoIncorrecto.resumen += "Ingrese Distrito válido. "
                            todoCorrecto = false;
                        } else {
                            documentoCorrecto.distrito = distrito;
                        }
                    }
                }

                if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][6])) {
                    let numeros = /^[0-9]$/;
                    let telefono = data[i][6];
                    if (numeros.test(data[i][6])) {
                        documentoIncorrecto.resumen += "Ingrese el teléfono solo con números. "
                        todoCorrecto = false;
                        return;
                    }
                    if (telefono.length < 4) {
                        documentoIncorrecto.resumen += "Ingrese el teléfono con más de 3 números. "
                        todoCorrecto = false;

                    }
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][7])) {
                    documentoIncorrecto.resumen += "Ingrese la dirección. "
                    todoCorrecto = false;
                } else {
                    let patron = /^(?:\D*\d){2,}\D*$/;
                    if (!patron.test(data[i][7])) {
                        documentoIncorrecto.resumen += "Ingrese por lo menos 2 dígitos en la dirección. "
                        documentoIncorrecto.direccion = data[i][7] || "";
                        todoCorrecto = false;
                    }
                }

                if (!todoCorrecto) {
                    documentoIncorrecto.numeroDocumento = data[i][0] || "";
                    documentoIncorrecto.razonSocial = data[i][1] || "";
                    documentoIncorrecto.contacto = data[i][2] || "";
                    documentoIncorrecto.departamento = data[i][3] || "";
                    documentoIncorrecto.provincia = data[i][4] || "";
                    documentoIncorrecto.distrito = data[i][5] || "";
                    documentoIncorrecto.telefono = data[i][6] || "";
                    documentoIncorrecto.direccion = data[i][7] || "";
                    documentoIncorrecto.referencia = data[i][8] || "";
                    registrosIncorrectos.push(documentoIncorrecto);
                } else {
                    documentoCorrecto.nroDocumento = data[i][0] || "";
                    documentoCorrecto.razonSocialDestino = data[i][1] || "";
                    documentoCorrecto.contactoDestino = data[i][2] || "";
                    documentoCorrecto.telefono = data[i][6] || "";
                    documentoCorrecto.direccion = data[i][7] || "";
                    documentoCorrecto.referencia = data[i][8] || "";
                    registrosCorrectos.push(documentoCorrecto);
                }

                i++;
            }
            envio.documentos = registrosCorrectos
            envio.inconsistenciasDocumento = registrosIncorrectos;
            callback(envio);
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

    subirReporte(documentos: Documento[]): Observable<any> {
        return this.requesterService.put<any>(this.REQUEST_URL + "cargaresultado", documentos, {});
    }

    listarDocumentosEntregados(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "entregados", {});
    }

    listarDocumentosPorDevolver(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "pordevolver", {});
    }

    listarDocumentosConResultadosYRecepcionados(): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentosrecepcion", {});
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

    recepcionarDocumento(codigo: number, tiposDevolucion: TipoDevolucion[]): Observable<Documento> {
        return this.requesterService.put<Documento>(this.REQUEST_URL + codigo + "/recepcion", tiposDevolucion, {});
    }

    listarCargos(fechaini: Date, fechafin: Date): Observable<Documento[]> {
        return this.requesterService.get<Documento[]>(this.REQUEST_URL + "documentoscargos", { params: new HttpParams().append('fechaini', fechaini.toString()).append('fechafin', fechafin.toString()) });
    }

    asignarCodigoDevolucionCargo(id: number, codigo: string): Observable<Documento> {
        return this.requesterService.post<Documento>(this.REQUEST_URL + id + "/codigodevolucion", codigo, {});
    }

    validarResultadosDelProveedor(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let i = 1
            let envio: Envio = new Envio();
            let resultadosCorrectos: Documento[] = [];
            let resultadosIncorrectos: InconsistenciaResultado[] = [];

            while (true) {

                if (this.utilsService.isUndefinedOrNull(data[i])) {
                    if (i === 1) {
                        callback({
                            mensaje: "El formato está vacío "
                        });
                        return;
                    } else {
                        break;
                    }
                }

                if (data[i].length === 0) {
                    break;
                }

                let todoCorrecto: boolean = true;

                let resultadoCorrecto: Documento = new Documento();
                let resultadoIncorrecto: InconsistenciaResultado = new InconsistenciaResultado();
                let estadoDocumentoValido: EstadoDocumento;
                let motivoEstadoValido: MotivoEstado;

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][1])) {
                    resultadoIncorrecto.resumen += "Ingrese el autogenerado. "
                    todoCorrecto = false;
                }

                let seguimientoDocumento = new SeguimientoDocumento;

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][17])) {
                    resultadoIncorrecto.resumen += "Ingrese un estado válido (Es posible que el motivo y el link estén incorrectos). "
                    todoCorrecto = false;
                } else {
                    let estadoDocumento = this.estadoDocumentoService.getEstadosDocumentoResultadosProveedor().find(
                        estadoDocumento => estadoDocumento.nombre === data[i][17]
                    )

                    if (this.utilsService.isUndefinedOrNullOrEmpty(estadoDocumento)) {
                        resultadoIncorrecto.resumen += "El estado ingresado no existe (Es posible que el motivo y el link estén incorrectos). "
                        todoCorrecto = false;
                    } else {
                        estadoDocumentoValido = estadoDocumento
                        if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][18])) {
                            resultadoIncorrecto.resumen += "Ingrese un motivo válido (Es posible que el link esté incorrecto). "
                            todoCorrecto = false;
                        } else {
                            let motivoEstado = estadoDocumento.motivos.find(motivo => motivo.nombre === data[i][18]);
                            if (this.utilsService.isUndefinedOrNullOrEmpty(motivoEstado)) {
                                resultadoIncorrecto.resumen += "El motivo ingresado no existe (Es posible que el link esté incorrecto). "
                                todoCorrecto = false;
                            }
                            motivoEstadoValido = motivoEstado;
                        }
                        //
                        if ((estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO || estadoDocumento.id === EstadoDocumentoEnum.REZAGADO) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][19])) {
                            resultadoIncorrecto.resumen += "Ingrese el link del documento. "
                            todoCorrecto = false;
                        }

                    }
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][20])) {
                    resultadoIncorrecto.resumen += "Ingrese la fecha de resultado. "
                    todoCorrecto = false;
                } else {
                    if (this.utilsService.isValidDate(data[i][20])) {
                        resultadoIncorrecto.resumen += "Ingrese la fecha en el formato correcto. "
                        todoCorrecto = false;
                    }
                    var dateDay = new Date();
                    var fechaReporte = data[i][20];
                    var fechaalgo = this.util.getJsDateFromExcel(fechaReporte);
                    var b = fechaReporte
                    var a = fechaReporte;
                    if (dateDay < a) {
                        resultadoIncorrecto.resumen += "La fecha de resultado es incorrecta."
                        todoCorrecto = false;
                    }
                }


                if (!todoCorrecto) {
                    resultadoIncorrecto.guia = data[i][0] || "";
                    resultadoIncorrecto.autogenerado = data[i][1] || "";
                    resultadoIncorrecto.guiaautogenerado = data[i][2] || "";
                    resultadoIncorrecto.sede = data[i][3] || "";
                    resultadoIncorrecto.plazo = data[i][4] || "";
                    resultadoIncorrecto.seguridad = data[i][5] || "";
                    resultadoIncorrecto.servicio = data[i][6] || "";
                    resultadoIncorrecto.clasificacion = data[i][7] || "";
                    resultadoIncorrecto.producto = data[i][8] || "";
                    resultadoIncorrecto.razonsocial = data[i][9] || "";
                    resultadoIncorrecto.contacto = data[i][10] || "";
                    resultadoIncorrecto.departamento = data[i][11] || "";
                    resultadoIncorrecto.provincia = data[i][12] || "";
                    resultadoIncorrecto.distrito = data[i][13] || "";
                    resultadoIncorrecto.direccion = data[i][14] || "";
                    resultadoIncorrecto.referencia = data[i][15] || "";
                    resultadoIncorrecto.telefono = data[i][16] || "";
                    resultadoIncorrecto.estado = data[i][17] || "";
                    resultadoIncorrecto.motivo = data[i][18] || "";
                    resultadoIncorrecto.link = data[i][19] || "";
                    resultadoIncorrecto.fecharesultado = data[i][20] || "";
                    resultadosIncorrectos.push(resultadoIncorrecto);
                } else {
                    resultadoCorrecto.documentoAutogenerado = data[i][1];
                    seguimientoDocumento.estadoDocumento = estadoDocumentoValido;
                    seguimientoDocumento.motivoEstado = motivoEstadoValido;
                    seguimientoDocumento.linkImagen = data[i][19] || "";
                    seguimientoDocumento.fecha = moment(this.utilsService.getJsDateFromExcel(data[i][20])).tz("America/Lima").format('DD-MM-YYYY HH:mm:ss');
                    resultadoCorrecto.seguimientosDocumento.push(seguimientoDocumento);
                    resultadosCorrectos.push(resultadoCorrecto);
                }
                i++;
            }
            envio.documentos = resultadosCorrectos;
            envio.inconsistenciasResultado = resultadosIncorrectos;
            callback(envio);
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

    exportarInconsistenciasMasivoyBloque(inconsistencias) {
        let objects = [];
        inconsistencias.forEach(inconsistencia => {
            objects.push({
                "Nro Documento": inconsistencia.numeroDocumento,
                "Razón Social": inconsistencia.razonSocial,
                "Contacto": inconsistencia.contacto,
                "Departamento": inconsistencia.departamento,
                "Provincia": inconsistencia.provincia,
                "Distrito": inconsistencia.distrito,
                "Teléfono": inconsistencia.telefono,
                "Dirección": inconsistencia.direccion,
                "Referencia": inconsistencia.referencia,
                "Resúmen de inconsistencias": inconsistencia.resumen
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Inconsistencias de Documentos: ");
    }


    exportarInconsistenciasResultadosProveedor(inconsistencias) {
        let objects = [];
        inconsistencias.forEach(inconsistencia => {
            objects.push({
                "Guía": inconsistencia.guia,
                "Autogenerado": inconsistencia.autogenerado,
                "Guía+Autogenerado": inconsistencia.guiaautogenerado,
                "Sede": inconsistencia.sede,
                "Plazo de Distribución": inconsistencia.plazo,
                "Tipo de Seguridad": inconsistencia.seguridad,
                "Tipo de Servicio": inconsistencia.servicio,
                "Clasificación": inconsistencia.clasificacion,
                "Producto": inconsistencia.producto,
                "Razón Social": inconsistencia.razonsocial,
                "Contacto": inconsistencia.contacto,
                "Departamento": inconsistencia.departamento,
                "Provincia": inconsistencia.provincia,
                "Distrito": inconsistencia.distrito,
                "Dirección": inconsistencia.direccion,
                "Referencia": inconsistencia.referencia,
                "Teléfono": inconsistencia.telefono,
                "Estado": inconsistencia.estado,
                "Motivo": inconsistencia.motivo,
                "Link": inconsistencia.link,
                "Fecha de Resultado": inconsistencia.fecha,
                "Resumen de inconsistencias": inconsistencia.resumen
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Inconsistencias de Resultados: ");
    }

    exportarDevoluciones(documentos) {
        let objects = [];
        documentos.forEach(documento => {
            objects.push({
                "Autogenerado": documento.documentoAutogenerado,
                "Remitente": documento.envio.buzon.nombre,
                "Área del remitente": documento.envio.buzon.area.nombre,
                "Fecha de entrega": this.getSeguimientoDocumentoByEstadoId(documento, 4) ? this.getSeguimientoDocumentoByEstadoId(documento, 4).fecha : this.getSeguimientoDocumentoByEstadoId(documento, 5) ? this.getSeguimientoDocumentoByEstadoId(documento, 5).fecha : "sin fecha",
                "Estado": this.getUltimoEstado(documento).nombre,
                "Motivo": this.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : "",
                "Físicos devueltos": documento.tiposDevolucion.sort((a, b) => a.id - b.id).map(tipoDevolucion => tipoDevolucion.nombre).join(", ")
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Documentos por cerrar");
    }




}


