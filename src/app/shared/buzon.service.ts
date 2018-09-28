import { Injectable } from "@angular/core";
import { RequesterService } from "./requester.service";
import { Buzon } from "../../model/buzon.model";
import { Subject } from "rxjs";


@Injectable()
export class BuzonService {

    constructor(private requester: RequesterService){}

    public buzonActualChanged = new Subject<Buzon>();

    private buzonesEmpleadoAutenticado: Buzon[];

    public getBuzonesEmpleadoAutenticado(): Buzon[]{
        return this.buzonesEmpleadoAutenticado;
    }

    public setBuzonesEmpleadoAutenticado(buzones: Buzon[]){
        this.buzonesEmpleadoAutenticado = buzones;
        
    }

    private buzonActual: Buzon;
    
    public getBuzonActual(): Buzon{
        return this.buzonActual;
    }    

    public setBuzonActual(buzon: Buzon){
        this.buzonActual = buzon;
        this.buzonActualChanged.next(this.buzonActual);
    }


}