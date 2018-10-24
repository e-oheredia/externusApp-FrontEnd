import { AppSettings } from './../../shared/app.settings';
import { Menu } from './../../../model/menu.model';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../shared/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menus: Menu[];
  logoPath = AppSettings.logoImagePath;
  
  constructor(private menuService: MenuService) { }  

  ngOnInit() {
    this.menus = this.menuService.getMenusAutenticado();  
    this.menuService.menusAutenticadoChanged.subscribe(
      menus => {
        this.menus = menus;
      }
    )
  }

}
