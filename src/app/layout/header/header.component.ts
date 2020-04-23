import { AppSettings } from './../../shared/app.settings';
import { Menu } from './../../../model/menu.model';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../shared/menu.service';
import { BrowserStorageService } from 'src/app/shared/browserstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menus: Menu[];
  logoPath = AppSettings.logoImagePath;
  
  constructor(private menuService: MenuService, private browserStorageService: BrowserStorageService) { }  

  ngOnInit() {
    this.menus = this.menuService.getMenusAutenticado();  
    this.menuService.menusAutenticadoChanged.subscribe(
      menus => {
        this.menus = menus;
      }
    )
  }

  cerrarSesion(){
    this.browserStorageService.remove('token', 'refreshtoken');
    window.location.href = AppSettings.LOGIN_PAGE;
  }

}
