import { Injectable, OnInit } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "./app.settings";
import { Ambito } from "src/model/ambito.model";
import { AmbitoDistrito } from "../../model/ambitodistrito";
import { WriteExcelService } from "./write-excel.service";
import { ReadExcelService } from "./read-excel.service";
import { UtilsService } from "./utils.service";
import { Distrito } from "src/model/distrito.model";

@Injectable()
export class AmbitoService {
    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.REGION_URL;
    REQUEST_URL2 = AppSettings.API_ENDPOINT + AppSettings.AMBITODISTRITO_URL;
    ;

    private ambitos: Ambito[];

    constructor
    (private requester: RequesterService, 
     private writeExcelService: WriteExcelService,
     private readExcelService: ReadExcelService,
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

    getAmbitosparaSubir(){
        return this.ambitos
    }

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

    validarDistritosAmbitos(file: File, sheet: number, callback: Function) {
        this.readExcelService.excelToJson(file, sheet, (data: Array<any>) => {
            let i = 1
            let distritos: Distrito[] = []
            let distritosconAmbitos: Distrito[] = []

            while (true) {

                if (this.utilsService.isUndefinedOrNull(data[i])) {
                    if (i === 1) {
                        callback({
                            mensaje: "El formato está vacío"
                        });
                        return;
                    } else {
                        break;
                    }
                }

                if (data[i].length === 0) {
                    break;
                }

                // let todoCorrecto: boolean = true;
                let distritoValidado: Distrito = new Distrito();

                if (!this.utilsService.isUndefinedOrNullOrEmpty(data[i][0])) {
                    distritoValidado.ubigeo = data[i][0]
                } else {
                    callback({
                        mensaje: "Ingrese el ubigeo en la fila " + (i + 1)
                    });
                    return;
                }

                if (this.utilsService.isUndefinedOrNullOrEmpty(data[i][4])) {
                    callback({
                        mensaje: "Ingrese el ámbito en la fila " + (i + 1)
                    });
                    return;
                } else {
                    let ambito = this.getAmbitosparaSubir().find(
                        ambito => ambito.nombre === data[i][4]
                    )

                    if (this.utilsService.isUndefinedOrNullOrEmpty(ambito)) {
                        callback({
                            mensaje: "Ingrese un ámbito existente en la fila " + (i + 1)
                        });
                        return;
                    } else {
                        distritoValidado.ambito = ambito
                    }
                }
                distritosconAmbitos.push(distritoValidado)
                distritos = distritosconAmbitos
                i++;
            }
            callback(distritos)
        });
    }

    subirDistritosconAmbitos(distritos: Distrito[]): Observable<any> {
        return this.requester.put<any>(this.REQUEST_URL2, distritos, {});
    }


}