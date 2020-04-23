import { MenuService } from './shared/menu.service';
import { BrowserStorageService } from './shared/browserstorage.service';
import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './shared/empleado.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RequesterService } from './shared/requester.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public empleadoService: EmpleadoService,
    private browserStorageService: BrowserStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private requesterService: RequesterService,
    private spinnerService: NgxSpinnerService,
  ) { 


   }



  ngOnInit() {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          let url = this.router.parseUrl(event.url).root;
          if (Object.keys(url.children).length === 0) {
            this.route.queryParams.subscribe(
              params => {
                if (params.token !== undefined) {
                  this.browserStorageService.set("token", params.token);
                  this.browserStorageService.set("refreshtoken", params.rt);
                }
                this.menuService.llenarMenuAutenticado();
              }
            );
          } else {
            this.empleadoService.listarEmpleadoAutenticado();
            this.menuService.llenarMenuAutenticado();
          }
        }
      }
    );
    this.subscribeToLoading();
  }

  subscribeToLoading(){
    
    var i = 0;

    this.requesterService.onLoading.subscribe(action => {
      
      

      if (action) {
        i++;
        if (i== 1) {
          setTimeout(() => {
            if (i>=1) {
              this.spinnerService.show();
            }
          }, 1000);          
        }        
      }else{
        i--;
        if (i == 0) {
          this.spinnerService.hide();
        }        
      }
    });
  }



}
