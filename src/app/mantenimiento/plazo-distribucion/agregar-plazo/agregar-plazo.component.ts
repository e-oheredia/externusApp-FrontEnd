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

    this.agregarForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'tiempoEnvio': new FormControl('', Validators.required),
      'tipoPlazoDistribucion': new FormControl(null, Validators.required)
    })
  }

  cargarDatosVista() {
    this.tiposPlazos = this.tipoPlazosService.getTiposPlazosDistribucion();
    this.tiposPlazosSubscription = this.tipoPlazosService.tiposPlazosDistribucionChanged.subscribe(
      tiposPlazos => {
        this.tiposPlazos = tiposPlazos;
      }
    )
  }

  onSubmit(plazo) {
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (nombreSinEspacios.length !== 0 && this.agregarForm.controls['tiempoEnvio'].value.length !== 0 && this.agregarForm.controls['tipoPlazoDistribucion'].value.length !== 0) {
      plazo.nombre = nombreSinEspacios;
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
