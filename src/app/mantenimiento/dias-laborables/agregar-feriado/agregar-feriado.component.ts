import { Component, OnInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { FeriadoService } from 'src/app/shared/feriado.service';
import { Feriado } from 'src/model/feriado.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Region } from 'src/model/region.model';
import * as moment from "moment-timezone";
import { RegionService } from 'src/app/shared/region.service';
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
    private regionService: RegionService,
    private periodoService: TipoPeriodoService,
  ) { }

  @Output() feriadoCreadoEvent = new EventEmitter<Feriado>();

  feriado: Feriado;
  feriados: Feriado[] = [];
  agregarForm: FormGroup;
  regiones: Region[] = [];
  regionesElegidas: Region[] = [];
  periodos: TipoPeriodo[];

  crearFeriadoSubscription: Subscription;
  periodoSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.agregarForm = new FormGroup({
      'nombre' : new FormControl('', Validators.required),
      'fecha' : new FormControl('', Validators.required),
      'periodo' : new FormControl(null, Validators.required),
      'regiones': new FormControl('', Validators.required)
    });
    this.listarRegiones();
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
    
    let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
    if (nombreSinEspacios.length !== 0 && this.regionesElegidas.length !== 0) {
      let feriado: Feriado = new Feriado();
      feriado.nombre = nombreSinEspacios;
      feriado.fecha = moment(this.agregarForm.controls['fecha'].value).format('DD-MM-YYYY');
      feriado.tipoperiodo = this.agregarForm.get("periodo").value;
      feriado.regiones = this.regionesElegidas;
      this.crearFeriadoSubscription = this.feriadoService.agregarFeriado(feriado).subscribe(
        feriado => {
          this.notifier.notify('success', 'Se agregó el feriado con éxito');
          this.bsModalRef.hide();
          this.feriadoCreadoEvent.emit(feriado);
        },
        error => {
          if (error.status === 400){
            this.notifier.notify('error', error.error.message);
          }
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar todos los datos');
    }
  }

  listarRegiones(){
    this.regiones = this.regionService.getRegiones();
    this.regionService.regionesChanged.subscribe(
      regiones => this.regiones = regiones
    )
  }

  onChangeRegionElegida(event: any, region: Region) {    
    event.srcElement.checked ? this.regionesElegidas.push(region) : this.regionesElegidas.splice(this.regionesElegidas.indexOf(region), 1);
  }


}
