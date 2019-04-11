import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SubAmbitoService } from 'src/app/shared/subambito.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { SubAmbito } from 'src/model/subambito.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { Ambito } from 'src/model/ambito.model';

@Component({
  selector: 'app-agregar-subambito',
  templateUrl: './agregar-subambito.component.html',
  styleUrls: ['./agregar-subambito.component.css']
})
export class AgregarSubambitoComponent implements OnInit {

  constructor(
    private subAmbitoService: SubAmbitoService,
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private ambitoService: AmbitoService
  ) { }

  @Output() subambitoCreadoEvent = new EventEmitter<SubAmbito>();

  subambito: SubAmbito = new SubAmbito();
  subambitos: SubAmbito[] = [];
  agregarForm: FormGroup;
  ambitos: Ambito[];

  crearSubAmbitoSubscription: Subscription;
  ambitoSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.agregarForm = new FormGroup({
      'nombre' : new FormControl('', Validators.required),
      'ambito' : new FormControl('', Validators.required)
    })
  }

  cargarDatosVista(){
    this.ambitos = this.ambitoService.getAmbitos();

    this.ambitoSubscription = this.ambitoService.ambitosChanged.subscribe(
      ambito => {
        this.ambitos = ambito;
      }
    )
  }

  onSubmit(subambito){
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (nombreSinEspacios.length !== 0) {
      subambito.nombre = nombreSinEspacios;
      this.subambito.nombre = this.agregarForm.get("nombre").value;
      this.subambito.ambito = this.agregarForm.get("ambito").value;
      this.crearSubAmbitoSubscription = this.subAmbitoService.agregarSubAmbito(subambito).subscribe(
        subambito => {
          this.notifier.notify('success', 'Se ha agregado el subambito correctamente');
          this.bsModalRef.hide();
          this.subambitoCreadoEvent.emit(subambito);
        },
        error => {
          this.notifier.notify('error', 'No se puede agregar un nombre existente');
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el nombre del subambito');
    }
  }



}

