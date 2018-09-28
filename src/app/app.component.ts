import { BrowserStorageService } from './shared/browserstorage.service';
import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './shared/empleado.service';
import { ActivatedRoute } from '../../node_modules/@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    public empleadoService: EmpleadoService,
    private browserStorageService: BrowserStorageService,
    private route: ActivatedRoute  
  ){}

  ngOnInit(){
    this.route.queryParams.subscribe(
      params => {
        if (params.token !== undefined) {
          this.browserStorageService.set("token", params.token);
          this.empleadoService.listarEmpleadoAutenticado();
        }
      }
    );
    // this.localStorage.set("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcmxhbmRvIiwiaWF0IjoxNTM2Mzk5MjAwLCJleHAiOjE1MzkzOTkyMDAsImlkVXN1YXJpbyI6IjEiLCJtYXRyaWN1bGEiOiJSR0FSQ8ONQSIsInBlcm1pc29zIjoiW3tcIm5vbWJyZVwiOiBcIlJPTEVfQ1JFQURPUl9ET0NVTUVOVE9cIn1dIn0.wMPFJQ97N3RvS-0OezTbEy-2w8FXF006CDUW2UoUJ9g");

    // this.empleadoService.listarEmpleadoAutenticado();
  }

}
