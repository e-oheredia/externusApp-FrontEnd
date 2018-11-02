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

    }

    getMenusAutenticado(): Menu[] {
        return this.menusAutenticado;
    }

    setMenusAutenticado(menusAutenticado) {
        this.menusAutenticado = menusAutenticado;
    }

    listarMenusAutenticado(): Observable<Menu[]> {
        return this.requester.get<Menu[]>(this.REQUEST_URL, {});
    }

    llenarMenuAutenticado() {
        this.listarMenusAutenticado().subscribe(
            menus => {
                this.ordenarMenu(menus);
                this.setMenusAutenticado(menus);
                this.menusAutenticadoChanged.next(menus);
            }
        )
    }

    ordenarMenu(menus: Menu[]){
        menus.sort((a,b) => a.opcion ? a.opcion.orden - b.opcion.orden : 1);
        menus.forEach(menu => {
            if (menu.hijosMenu.length > 0) {
                this.ordenarMenu(menu.hijosMenu);
            }
        });
    }

}   