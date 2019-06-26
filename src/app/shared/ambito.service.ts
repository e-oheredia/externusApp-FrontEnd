import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";
import { AmbitoDistrito } from "../../model/ambitodistrito";
import { WriteExcelService } from "./write-excel.service";
import { ReadExcelService } from "./read-excel.service";
import { UtilsService } from "./utils.service";
import * as moment from 'moment-timezone';
import { EstadoDocumentoEnum } from "../enum/estadodocumento.enum";
import { InconsistenciaResultado } from "../../model/inconsistenciaresultado.model";


@Injectable()
export class AmbitoService {
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;
    REQUEST_URL2 = AppSettings.API_ENDPOINT + AppSettings.AMBITODISTRITO_URL;
    ;

    private ambitos: Ambito[];

    constructor
    (private requester: RequesterService, 
     private readExcelService: ReadExcelService,
     private writeExcelService: WriteExcelService,
     private utilsService: UtilsService
    ){
        
        this.listarAmbitosAll().subscribe(
            ambitos => {
                this.ambitos = ambitos;
                this.ambitosChanged.next(this.ambitos);
            }
        )
    }    
    
    getAmbitos(): Ambito[] { 
        return this.ambitos;
    }

    public ambitosChanged = new Subject<Ambito[]>();

    listarAmbitosAll(): Observable<Ambito[]> {
        return this.requester.get<Ambito[]>(this.REQUEST_URL + "ambitos", {});
    }

    listarAmbitosPorRegion(regionId: number): Observable<Ambito[]>{
        return this.requester.get<Ambito[]>(this.REQUEST_URL + regionId.toString() + "/ambitos/activos", {});
    }

    agregarAmbito(ambito: Ambito): Observable<Ambito>{
        return this.requester.post<Ambito>(this.REQUEST_URL, ambito, {});
    }

    modificarAmbito(id:number, ambito: Ambito): Observable<Ambito> {
        return this.requester.put<Ambito>(this.REQUEST_URL + id + "/ambitos", ambito, {});
    }

    listarAmbitoDistritos() :Observable< AmbitoDistrito[]> {
        return this.requester.get<AmbitoDistrito[]>(this.REQUEST_URL2, {});
    }

    exportarAmbitoDistrito(ambitodistrito) {
        let objects = [];
        ambitodistrito.forEach(adistrito => {
            objects.push({
                "Ubigeo": adistrito.distrito.ubigeo, 
                "Departamento": adistrito.distrito.provincia.departamento.nombre,
                "Provincia":  adistrito.distrito.provincia.nombre,
                "Distrito":adistrito.distrito.nombre,
                "Ambito":adistrito.ambito.nombre
            })
        });
        this.writeExcelService.jsonToExcel(objects, "Ubigeo_Distrito_Ambito");
    }

    exportarInconsistenciasResultadosProveedor(inconsistencias){

    }

    validarResultadosDelProveedor(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let i = 1
            //let envio: Envio = new Envio();
            //let resultadosCorrectos: Documento[] = [];
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

                //let resultadoCorrecto: Documento = new Documento();
                let resultadoIncorrecto: InconsistenciaResultado = new InconsistenciaResultado();
                //let estadoDocumentoValido: EstadoDocumento;
                //let motivoEstadoValido: MotivoEstado;

                // let documentoCargado = new Documento();

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][0])) {
                    resultadoIncorrecto.resumen += "Ingrese el ubigeo. "
                    todoCorrecto = false;
                }

                if(this.utilsService.isUndefinedOrNullOrEmpty(data[i][3])){
                    resultadoIncorrecto.resumen += "Ingrese el distrito. "
                    todoCorrecto = false;
                }

                if(this.utilsService.isUndefinedOrNullOrEmpty(data[i][4])){
                    resultadoIncorrecto.resumen += "Ingrese el ambito. "
                    todoCorrecto = false;
                }
                // if ((estadoDocumento.id === EstadoDocumentoEnum.ENTREGADO ||
                //     estadoDocumento.id === EstadoDocumentoEnum.REZAGADO ||
                //     estadoDocumento.id === EstadoDocumentoEnum.NO_DISTRIBUIBLE) && this.utilsService.isUndefinedOrNullOrEmpty(data[i][18])) {

                //     resultadoIncorrecto.resumen += "Ingrese el motivo del estado. "
                //     todoCorrecto = false;
                // }

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
/*                     resultadoCorrecto.documentoAutogenerado = data[i][1];
                    seguimientoDocumento.estadoDocumento = estadoDocumentoValido;
                    seguimientoDocumento.motivoEstado = motivoEstadoValido;
                    seguimientoDocumento.linkImagen = data[i][19] || "";
                    seguimientoDocumento.fecha = moment(this.utilsService.getJsDateFromExcel(data[i][20])).tz("America/Lima").format('DD-MM-YYYY HH:mm:ss');
                    resultadoCorrecto.seguimientosDocumento.push(seguimientoDocumento);
                    resultadosCorrectos.push(resultadoCorrecto); */
                }

                i++;
            }

/*             envio.documentos = resultadosCorrectos;
            envio.inconsistenciasResultado = resultadosIncorrectos;

            callback(envio); */

        });
    }


}