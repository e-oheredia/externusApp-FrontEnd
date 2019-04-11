import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoSeguridadService } from 'src/app/shared/tiposeguridad.service';
import { TipoSeguridad } from 'src/model/tiposeguridad.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-tipo-seguridad',
  templateUrl: './modificar-tipo-seguridad.component.html',
  styleUrls: ['./modificar-tipo-seguridad.component.css']
})
export class ModificarTipoSeguridadComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tipoSeguridadService: TipoSeguridadService
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  estados: boolean;
  tipoSeguridad: TipoSeguridad;
  tiposSeguridad: TipoSeguridad[] = [];
  modificarForm: FormGroup;

  modificarTipoSeguridadSubscribe: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.tipoSeguridad.nombre, Validators.required),
      'activo': new FormControl(this.tipoSeguridad.activo, Validators.required)
    })
  }

  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)) {
      let nombreSinEspacios = this.modificarForm.controls['nombre'].value.trim();
      this.tipoSeguridad.nombre = nombreSinEspacios;
      this.tipoSeguridad.activo = this.modificarForm.get('activo').value;
      this.modificarTipoSeguridadSubscribe = this.tipoSeguridadService.modificarTipoSeguridad(this.tipoSeguridad.id, this.tipoSeguridad).subscribe(
        tiposeguridad => {
          this.notifier.notify('success', 'Se ha modificado el tipo de seguirdad correctamente');
          this.bsModalRef.hide();
          this.confirmarEvent.emit(tiposeguridad);
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
      );
    }
  }



}
