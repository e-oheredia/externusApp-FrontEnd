import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TipoPlazoDistribucion } from 'src/model/tipoplazodistribucion.model';
import { TipoPlazoDistribucionService } from 'src/app/shared/tipoplazodistribucion.service';

@Component({
  selector: 'app-agregar-plazo',
  templateUrl: './agregar-plazo.component.html',
  styleUrls: ['./agregar-plazo.component.css']
})
export class AgregarPlazoComponent implements OnInit {

  constructor(
    private tipoPlazosService: TipoPlazoDistribucionService,
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  @Output() plazoCreadoEvent = new EventEmitter<PlazoDistribucion>();

  tiposPlazos: TipoPlazoDistribucion[];
  plazo: PlazoDistribucion;
  plazos: PlazoDistribucion[] = [];
  agregarForm: FormGroup;

  crearPlazoSubscription: Subscription;
  tiposPlazosSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();

    this.agregarForm = new FormGroup ({
      'nombre' : new FormControl('', Validators.required),
      'tiempoEnvio' : new FormControl('', Validators.required),
      'tipoPlazoDistribucion' : new FormControl(null, Validators.required)
    })
  }

  cargarDatosVista(){
    this.tiposPlazos = this.tipoPlazosService.getTiposPlazosDistribucion();
    this.tiposPlazosSubscription = this.tipoPlazosService.tiposPlazosDistribucionChanged.subscribe(
      tiposPlazos => {
        this.tiposPlazos = tiposPlazos;
      }
    )
  }

  onSubmit(plazo){
    this.crearPlazoSubscription = this.plazoDistribucionService.agregarPlazoDistribucion(plazo).subscribe(
      plazo => {
        this.notifier.notify('succes', 'Se ha registrado el plazo');
        this.bsModalRef.hide();
        this.plazoCreadoEvent.emit(plazo);        
      },
      error => {
        this.notifier.notify('error', error.error.mensaje);
      }
    )
    // if (!this.utilsService.isUndefinedOrNullOrEmpty(this.agregarForm.controls['nombrePlazo'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.agregarForm.controls['horasPlazo'].value)){
    //   this.plazo.nombre = this.agregarForm.get("nombrePlazo").value;
    //   this.plazo.tiempoEnvio = this.agregarForm.get("horasPlazo").value;

    //   this.plazoDistribucionService.agregarPlazoDistribucion(this.plazo)
    // }
  }

}
