import { Buzon } from './../../../model/buzon.model';
import { BuzonService } from './../../shared/buzon.service';
import { AreaService } from './../../shared/area.service';
import { PlazoDistribucionService } from './../../shared/plazodistribucion.service';
import { PlazoDistribucion } from './../../../model/plazodistribucion.model';
import { Area } from './../../../model/area.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-permiso-plazo-distribucion',
  templateUrl: './permiso-plazo-distribucion.component.html',
  styleUrls: ['./permiso-plazo-distribucion.component.css']
})
export class PermisoPlazoDistribucionComponent implements OnInit, OnDestroy {

  constructor(
    private buzonService: BuzonService, 
    private areaService: AreaService,
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  buzonForm: FormGroup;
  areaForm: FormGroup;
  plazoDistribucion: PlazoDistribucion;
  buzon: Buzon;

  buzonesObservable: Observable<Buzon[]>;
  areasObservable: Observable<Area[]>;
  plazosDistribucion: PlazoDistribucion[];

  plazosDistribucionSubscription: Subscription = new Subscription(); 
  buzonPlazoDistribucionSubscripcion: Subscription = new Subscription(); 
  areaPlazoDistribucionSubscripcion: Subscription = new Subscription();

  ngOnInit() {
    this.cargarDatosVista();
    this.buzonForm = new FormGroup({
      'buzon': new FormControl(null),
      'plazoDistribucion': new FormControl(null)
    });
    this.areaForm = new FormGroup({
      'area': new FormControl(null),
      'plazoDistribucion': new FormControl(null)
    })
    
  }

  cargarDatosVista(){
    this.areasObservable = this.areaService.listarAreasAll();
    this.buzonesObservable = this.buzonService.listarBuzonesAll();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.plazosDistribucionSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(plazosDistribucion => {
      this.plazosDistribucion = plazosDistribucion
    })
  }

  onBuzonFormSubmit(buzonForm){
    this.buzonService.actualizarPlazoDistribucionPermitido(buzonForm.buzon.id, buzonForm.plazoDistribucion)
  }

  onAreaFormSubmit(areaForm){
    this.areaService.actualizarPlazoDistribucionPermitido(areaForm.area.id, areaForm.plazoDistribucion)
  }

  onBuzonChange(){
    this.buzonPlazoDistribucionSubscripcion = this.plazoDistribucionService.listarPlazoDistribucionPermititoByBuzonId(this.buzon.id).subscribe(
      plazoDistribucionBD =>
      this.buzonForm.get('plazoDistribucion').setValue(this.plazosDistribucion.find(plazoDistribucion => plazoDistribucion.id === plazoDistribucionBD.id))
    )
  }

  onAreaChange(){
    this.areaPlazoDistribucionSubscripcion = this.plazoDistribucionService.listarPlazoDistribucionPermititoByAreaId(this.areaForm.get('area').value.id).subscribe(
      plazoDistribucionBD =>
      this.buzonForm.get('plazoDistribucion').setValue(this.plazosDistribucion.find(plazoDistribucion => plazoDistribucion.id === plazoDistribucionBD.id))
    )
  }

  ngOnDestroy() {
    this.plazosDistribucionSubscription.unsubscribe();
    this.areaPlazoDistribucionSubscripcion.unsubscribe();
    this.buzonPlazoDistribucionSubscripcion.unsubscribe();
  }

  


}
