import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TituloService{    

    public tituloChanged = new Subject<string>();
    
    constructor() {}

    setTitulo(titulo){
        this.tituloChanged.next(titulo);
    }
}