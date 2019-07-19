import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { Ambito } from 'src/model/ambito.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegionService } from 'src/app/shared/region.service';
import { Region } from 'src/model/region.model';

@Component({
  selector: 'app-agregar-ambito',
  templateUrl: './agregar-ambito.component.html',
  styleUrls: ['./agregar-ambito.component.css']
})
export class AgregarAmbitoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private ambitoService: AmbitoService,
    private regionService: RegionService
  ) { }

  @Output() ambitoCreadoEvent = new EventEmitter<Ambito>();

  ambito: Ambito = new Ambito();
  ambitos: Ambito[] = [];
  agregarForm: FormGroup;
  regiones: Region[];

  crearAmbitoSubscription: Subscription;
  regionSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.agregarForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'region': new FormControl('', Validators.required)
    })
  }

  cargarDatosVista() {
    this.regiones = this.regionService.getRegiones();

    this.regionSubscription = this.regionService.regionesChanged.subscribe(
      region => {
        this.regiones = region;
      }
    )
  }

  onSubmit(ambito) {
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (nombreSinEspacios.length !== 0) {
      ambito.nombre = nombreSinEspacios;
      this.ambito.nombre = this.agregarForm.get("nombre").value;
      this.ambito.region = this.agregarForm.get("region").value;
      this.crearAmbitoSubscription = this.ambitoService.agregarAmbito(ambito).subscribe(
        ambito => {
          this.notifier.notify('success', 'Se ha agregado el ámbito correctamente');
          this.bsModalRef.hide();
          this.ambitoCreadoEvent.emit(ambito);
        },
        error => {
          this.notifier.notify('error', 'No se puede agregar un nombre existente');
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el nombre del ámbito');
    }
  }



}

