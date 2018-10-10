import { AreaService } from './../../shared/area.service';
import { PlazoDistribucionService } from './../../shared/plazodistribucion.service';
import { EmpleadoService } from './../../shared/empleado.service';
import { PlazoDistribucion } from './../../../model/plazodistribucion.model';
import { Area } from './../../../model/area.model';
import { Empleado } from './../../../model/empleado.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permiso-plazo-distribucion',
  templateUrl: './permiso-plazo-distribucion.component.html',
  styleUrls: ['./permiso-plazo-distribucion.component.css']
})
export class PermisoPlazoDistribucionComponent implements OnInit {

  constructor(
    private empleadoService: EmpleadoService, 
    private areaService: AreaService,
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  empleadoForm: FormGroup;
  areaForm: FormGroup;

  empleadosObservable: Observable<Empleado[]>;
  areasObservable: Observable<Area[]>;
  plazosDistribucion: PlazoDistribucion[];

  plazosDistribucionSubscription: Subscription = new Subscription(); 

  ngOnInit() {
    this.cargarDatosVista();
    this.empleadoForm = new FormGroup({
      'empleado': new FormControl(null),
      'plazoDistribucion': new FormControl(null)
    });
    this.areaForm = new FormGroup({
      'area': new FormControl(null),
      'plazoDistribucion': new FormControl(null)
    })
    
  }

  cargarDatosVista(){
    this.areasObservable = this.areaService.listarAreasAll();
    this.empleadosObservable = this.empleadoService.listarEmpleadosAll();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.plazosDistribucionSubscription = this.plazoDistribucionService.listarPlazosDistribucion().subscribe(
      plazosDistribucion => this.plazosDistribucion = plazosDistribucion
    );
  }

  onEmpleadoFormSubmit(values){
    console.log(values);
  }

  onAreaFormSubmit(values){
    console.log(values);
  }


}
