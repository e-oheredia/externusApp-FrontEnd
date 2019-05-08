import { Component, OnInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { FeriadoService } from 'src/app/shared/feriado.service';
import { Feriado } from 'src/model/feriado.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ambito } from 'src/model/ambito.model';
import * as moment from "moment-timezone";
import { AmbitoService } from 'src/app/shared/ambito.service';
import { TipoPeriodoService } from 'src/app/shared/tipoperiodo.service';
import { TipoPeriodo } from 'src/model/tipoperiodo.model';

@Component({
  selector: 'app-agregar-feriado',
  templateUrl: './agregar-feriado.component.html',
  styleUrls: ['./agregar-feriado.component.css']
})
export class AgregarFeriadoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private feriadoService: FeriadoService,
    private ambitoService: AmbitoService,
    private periodoService: TipoPeriodoService,
  ) { }

  @Output() feriadoCreadoEvent = new EventEmitter<Feriado>();

  feriado: Feriado;
  feriados: Feriado[] = [];
  agregarForm: FormGroup;
  ambitos: Ambito[] = [];
  ambitosElegidos: Ambito[] = [];
  periodos: TipoPeriodo[];

  crearFeriadoSubscription: Subscription;
  periodoSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.agregarForm = new FormGroup({
      'nombre' : new FormControl('', Validators.required),
      'fecha' : new FormControl('', Validators.required),
      'periodo' : new FormControl(null, Validators.required),
      'ambitos': new FormControl('', Validators.required)
    });
    this.listarAmbitos();
  }

  cargarDatosVista(){
    this.periodos = this.periodoService.getTiposPeriodo();

    this.periodoSubscription = this.periodoService.tiposPeriodoChanged.subscribe(
      periodos => {
        this.periodos = periodos
      }
    )
  }

  onSubmit(){
    console.log(this.agregarForm.value);
    let fechadate = new Date(this.agregarForm.controls['fecha'].value);
    
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (nombreSinEspacios.length !== 0 && this.ambitosElegidos.length !== 0) {
      let feriado: Feriado = new Feriado();
      feriado.nombre = nombreSinEspacios;
      feriado.fecha = moment(fechadate).format('DD-MM-YYYY');
      feriado.modeltipo = this.agregarForm.get("periodo").value;
      feriado.ambitos = this.ambitosElegidos;
      this.crearFeriadoSubscription = this.feriadoService.agregarFeriado(feriado).subscribe(
        feriado => {
          this.notifier.notify('success', 'Se ha agregado el feriado correctamente');
          this.bsModalRef.hide();
          this.feriadoCreadoEvent.emit(feriado);
        },
        error => {
          this.notifier.notify('error', 'No se puede agregar un nombre existente');
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar todos los datos');
    }
  }

  listarAmbitos(){
    this.ambitos = this.ambitoService.getAmbitos();
    this.ambitoService.ambitosChanged.subscribe(
      ambitos => this.ambitos = ambitos
    )
  }

  onChangeAmbitoElegido(event: any, ambito: Ambito) {    
    event.srcElement.checked ? this.ambitosElegidos.push(ambito) : this.ambitosElegidos.splice(this.ambitosElegidos.indexOf(ambito), 1);
  }


}
