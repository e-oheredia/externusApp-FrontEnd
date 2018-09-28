import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { AppSettings } from "./app.settings";
import { Observable } from "rxjs";
import { Empleado } from "../../model/empleado.model";
import { BuzonService } from "./buzon.service";
import { BuzonEmpleado } from "../../model/buzonempleado.model";
import { Buzon } from "../../model/buzon.model";


@Injectable()
export class EmpleadoService {

    constructor(private requester: RequesterService, private buzonService: BuzonService){}

    private empleadoAutenticado: Empleado;

    public getEmpleadoAutenticado(){
        return this.empleadoAutenticado;
    }   

    listarEmpleadoAutenticado(){
        this.requester.get<Empleado>(AppSettings.API_ENDPOINT + AppSettings.EMPLEADO_URL + "autenticado", {})
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
}