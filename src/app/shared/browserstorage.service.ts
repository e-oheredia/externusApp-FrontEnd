import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class BrowserStorageService {

    constructor(private localStorageService: LocalStorageService){}

    public tokenActualChanged = new Subject();

    set(key: string, value: string){
        this.localStorageService.set(key, value);
        this.tokenActualChanged.next();
    }

    get(key:string): string {
        return this.localStorageService.get(key);
    }

}