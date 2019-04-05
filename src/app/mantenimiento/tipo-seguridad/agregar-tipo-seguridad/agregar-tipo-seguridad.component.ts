import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TipoSeguridadService } from 'src/app/shared/tiposeguridad.service';
import { TipoSeguridad } from 'src/model/tiposeguridad.model';

@Component({
  selector: 'app-agregar-tipo-seguridad',
  templateUrl: './agregar-tipo-seguridad.component.html',
  styleUrls: ['./agregar-tipo-seguridad.component.css']
})
export class AgregarTipoSeguridadComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private tipoSeguridadService: TipoSeguridadService
  ) { }

  @Output() tipoSeguridadCreadoEvent = new EventEmitter<TipoSeguridad>();

  tipoSeguridad: TipoSeguridad;
  tiposSeguridad: TipoSeguridad[] = [];
  agregarForm: FormGroup;

  crearTipoSeguridadSubscription: Subscription;

  ngOnInit() {
    // this.cargarDatosVista();

    this.agregarForm = new FormGroup({
      'nombre': new FormControl('', Validators.required)
    })
  }

  cargarDatosVista() {
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
  }

  onSubmit(tipoSeguridad) {
    if (this.agregarForm.controls['nombre'].value.length !== 0) {
      this.crearTipoSeguridadSubscription = this.tipoSeguridadService.agregarTipoSeguridad(tipoSeguridad).subscribe(
        tipoSeguridad => {
          this.notifier.notify('success', 'SE AGREGÓ EL TIPO DE SEGURIDAD CON ÉXITO');
          this.bsModalRef.hide();
          this.tipoSeguridadCreadoEvent.emit(tipoSeguridad);
        },
        error => {
          this.notifier.notify('error', error.error.mensaje);
        }
      );
    }
    else {
      this.notifier.notify('error', 'DEBE INGRESAR EL NOMBRE DEL TIPO DE SEGURIDAD');
    }
  }


  

}
