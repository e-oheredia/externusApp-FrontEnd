import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";
import { Empleado } from "../../model/empleado.model";
import { BuzonService } from "./buzon.service";
import { Buzon } from "../../model/buzon.model";


@Injectable()
export class EmpleadoService {

    constructor(private requester: RequesterService, private buzonService: BuzonService){}

    private empleadoAutenticado: Empleado;

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.EMPLEADO_URL;

    public getEmpleadoAutenticado(){
        return this.empleadoAutenticado;
    }   

    listarEmpleadoAutenticado(){
        this.requester.get<Empleado>(this.REQUEST_URL + "autenticado", {})
        .subscribe(
            empleado => {
                this.empleadoAutenticado = empleado;
                let buzones: Buzon[] = [];
                empleado.buzones.forEach(buzonEmpleado => {
                    buzones.push(buzonEmpleado.buzon);
                });
                this.buzonService.setBuzonesEmpleadoAutenticado(buzones);     
                this.buzonService.setBuzonActual(buzones[0]);           
            }, 
            error => {
                console.log(error);
            }            
        );
    }

    listarEmpleadosAll(): Observable<Empleado[]>{
        return this.requester.get(this.REQUEST_URL, {});
    }
}