import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TipoPlazoDistribucion } from 'src/model/tipoplazodistribucion.model';
import { TipoPlazoDistribucionService } from 'src/app/shared/tipoplazodistribucion.service';
import { Ambito } from 'src/model/ambito.model';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { Region } from 'src/model/region.model';
import { RegionService } from 'src/app/shared/region.service';

@Component({
  selector: 'app-agregar-plazo',
  templateUrl: './agregar-plazo.component.html',
  styleUrls: ['./agregar-plazo.component.css']
})
export class AgregarPlazoComponent implements OnInit {

  constructor(
    private tipoPlazosService: TipoPlazoDistribucionService,
    private ambitoService: AmbitoService,
    private regionService: RegionService,
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  @Output() plazoCreadoEvent = new EventEmitter<PlazoDistribucion>();

  tiposPlazos: TipoPlazoDistribucion[];
  plazo: PlazoDistribucion;
  plazos: PlazoDistribucion[] = [];
  ambito: Ambito;
  ambitos: Ambito[] = [];
  regiones: Region[] = [];
  agregarForm: FormGroup;
  arregloregiones = [];
  plazitos: PlazoDistribucion;
  crearPlazoSubscription: Subscription;
  tiposPlazosSubscription: Subscription;
  regionesSubscription: Subscription;
  ambitosSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();

    this.agregarForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'tiempoEnvio': new FormControl('', Validators.required),
      'tipoPlazoDistribucion': new FormControl(null, Validators.required),
      'regiones': new FormControl(null, Validators.required)
    })
  }

  cargarDatosVista() {
    this.tiposPlazos = this.tipoPlazosService.getTiposPlazosDistribucion();
    this.tiposPlazosSubscription = this.tipoPlazosService.tiposPlazosDistribucionChanged.subscribe(
      tiposPlazos => {
        this.tiposPlazos = tiposPlazos;
      }
    )

    this.regiones = this.regionService.getRegiones();
    this.regionesSubscription = this.regionService.regionesChanged.subscribe(
      regiones => {
        this.regiones = regiones;
      }
    )

  }

  onRegionSelectedChanged(region) {
    this.ambitosSubscription = this.ambitoService.listarAmbitosPorRegion(region.id).subscribe(
      ambitos => {
        this.ambitos = ambitos;
      }
    );
  }


  onSubmit(form: any) {

    if (this.agregarForm.controls['nombre'].value.length !== 0 && this.agregarForm.controls['tiempoEnvio'].value.length !== 0 && 
    this.agregarForm.controls['tipoPlazoDistribucion'].value.length !== 0 && 
    this.agregarForm.controls['regiones'].value.length !== 0) {
      
      let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
      let plazo = Object.assign({}, this.plazo);
      plazo.nombre = nombreSinEspacios;
      plazo.tiempoEnvio = this.agregarForm.get("tiempoEnvio").value;
      plazo.tipoPlazoDistribucion = this.agregarForm.get('tipoPlazoDistribucion').value;
      plazo.regiones = [];
      let regioness=this.agregarForm.get('regiones').value;
      plazo.regiones.push(regioness);
       
      /*this.plazitos.regiones.push(plazo.regiones); */

      this.crearPlazoSubscription = this.plazoDistribucionService.agregarPlazoDistribucion(plazo).subscribe(
        plazo => {
          this.notifier.notify('success', 'Se ha agregado el plazo de distribución correctamente');
          this.bsModalRef.hide();
          this.plazoCreadoEvent.emit(plazo);
        },
        error => {
          this.notifier.notify('error', 'No se puede ingresar un nombre existente');
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar todos los datos');
    }
  }

}
