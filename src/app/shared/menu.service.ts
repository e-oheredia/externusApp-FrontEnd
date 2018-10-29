import { Subject } from 'rxjs';
import { Menu } from './../../model/menu.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { AppSettings } from "./app.settings";


@Injectable()
export class MenuService {

    REQUEST_URL = AppSettings.API_ENDPOINT + AppSettings.MENU_URL;
    private menusAutenticado: Menu[];
    menusAutenticadoChanged = new Subject<Menu[]>();
    
    constructor(
        private requester: RequesterService
    ) {
        this.listarMenusAutenticado().subscribe(
            menus => {
                this.menusAutenticado = menus;
                this.menusAutenticadoChanged.next(menus);
            }
        )
    }

    getMenusAutenticado(): Menu[] {
        return this.menusAutenticado;
    }

    listarMenusAutenticado(): Observable<Menu[]> {
        return this.requester.get<Menu[]>(this.REQUEST_URL, {});
    }
    
}   