import { NotifierService } from 'angular-notifier';
import { Buzon } from './../../../model/buzon.model';
import { BuzonService } from './../../shared/buzon.service';
import { AreaService } from './../../shared/area.service';
import { PlazoDistribucionService } from './../../shared/plazodistribucion.service';
import { PlazoDistribucion } from './../../../model/plazodistribucion.model';
import { Area } from './../../../model/area.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WriteExcelService } from 'src/app/shared/write-excel.service';

@Component({
  selector: 'app-permiso-plazo-distribucion',
  templateUrl: './permiso-plazo-distribucion.component.html',
  styleUrls: ['./permiso-plazo-distribucion.component.css']
})
export class PermisoPlazoDistribucionComponent implements OnInit, OnDestroy {

  constructor(
    private buzonService: BuzonService, 
    private areaService: AreaService,
    private plazoDistribucionService: PlazoDistribucionService, 
    private notifier: NotifierService,
    private writeExcelService: WriteExcelService
  ) { }

  buzonForm: FormGroup;
  areaForm: FormGroup;

  buzon: Buzon;
  buzones: Buzon[];
  buzonesObservable: Observable<Buzon[]>;

  area: Area;
  areas: Area[];
  areasObservable: Observable<Area[]>;

  plazoDistribucion: PlazoDistribucion;
  plazosDistribucion: PlazoDistribucion[];

  plazosDistribucionSubscription: Subscription = new Subscription(); 
  buzonPlazoDistribucionSubscripcion: Subscription = new Subscription(); 
  areaPlazoDistribucionSubscripcion: Subscription = new Subscription();

  ngOnInit() {
    this.cargarDatosVista();
    this.buzonForm = new FormGroup({
      'buzon': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required)
    });
    this.areaForm = new FormGroup({
      'area': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required)
    })
  }

  cargarDatosVista(){

    this.areasObservable = this.areaService.listarAreasAll(); //jala de bd en la 1ra
    this.areaService.listarAreasAll().subscribe(areas => { //cuando cambia
      this.areas = areas
    })

    this.buzonesObservable = this.buzonService.listarBuzonesAll();
    this.buzonService.listarBuzonesAll().subscribe(buzones => {
      this.buzones = buzones
    })

    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();//jala del frontend
    this.plazosDistribucionSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(plazosDistribucion => {
      this.plazosDistribucion = plazosDistribucion
    })
  }

  onBuzonFormSubmit(buzonForm){
    this.buzonService.actualizarPlazoDistribucionPermitido(buzonForm.buzon.id, buzonForm.plazoDistribucion).subscribe(
      plazoDistribucion => {
        this.notifier.notify('success', 'Se ha asignado correctamente el plazo de distribución');
        this.buzonForm.reset();
        this.cargarDatosVista();
      }
    )
  }

  onAreaFormSubmit(areaForm){
    this.areaService.actualizarPlazoDistribucionPermitido(areaForm.area.id, areaForm.plazoDistribucion).subscribe(
      plazoDistribucion => {
        this.notifier.notify('success', 'Se ha asignado correctamente el plazo de distribución');
        this.areaForm.reset();
        this.cargarDatosVista();
      }
    )
  }

  onBuzonChange(){
    if (this.buzonForm.get('buzon').value === null) {
      this.buzonForm.controls['plazoDistribucion'].setValue(null);
      return;      
    }
    this.buzonPlazoDistribucionSubscripcion = this.plazoDistribucionService.listarPlazoDistribucionPermititoByBuzonId(this.buzonForm.get('buzon').value.id).subscribe(
      buzonPlazoDistribucion =>
      this.buzonForm.controls['plazoDistribucion'].setValue(this.plazosDistribucion.find(plazoDistribucion => plazoDistribucion.id === buzonPlazoDistribucion.plazoDistribucion.id))
    )
  }

  onAreaChange(){
    if (this.areaForm.get('area').value === null) {
      this.areaForm.controls['plazoDistribucion'].setValue(null);
      return;      
    }
    this.areaPlazoDistribucionSubscripcion = this.plazoDistribucionService.listarPlazoDistribucionPermititoByAreaId(this.areaForm.get('area').value.id).subscribe(
      buzonPlazoDistribucion =>
      this.areaForm.controls['plazoDistribucion'].setValue(this.plazosDistribucion.find(plazoDistribucion => plazoDistribucion.id === buzonPlazoDistribucion.plazoDistribucion.id))
    )
  }


  exportarPorUsuario(buzones: Buzon[]) {
    this.buzonService.exportarPermisosDePlazosPorBuzon(buzones)
  }

  exportarPorArea() {
    this.areaService.exportarPermisosDePlazosPorArea(this.areas)
    console.log(this.areas)
  }
  

  ngOnDestroy() {
    this.plazosDistribucionSubscription.unsubscribe();
    this.areaPlazoDistribucionSubscripcion.unsubscribe();
    this.buzonPlazoDistribucionSubscripcion.unsubscribe();
  }

  
}
