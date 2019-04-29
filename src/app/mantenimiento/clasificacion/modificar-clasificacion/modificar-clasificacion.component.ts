import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { Clasificacion } from 'src/model/clasificacion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-modificar-clasificacion',
  templateUrl: './modificar-clasificacion.component.html',
  styleUrls: ['./modificar-clasificacion.component.css']
})
export class ModificarClasificacionComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private clasificacionService: ClasificacionService,
    private notifier: NotifierService,
    private modalService: BsModalService,
  ) { }

  @Output() clasificacionModificadaEvent = new EventEmitter();

  estados: boolean;
  clasificacion: Clasificacion;
  clasificaciones: Clasificacion[] = [];
  modificarForm: FormGroup;

  modificarClasificacionSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.clasificacion.nombre, Validators.required),
      'activo': new FormControl(this.clasificacion.activo, Validators.required)
    })
  }

  onSubmit(form: any) {
    if (this.modificarForm.controls['nombre'].value.length !== 0) {
      let clasificacion = Object.assign({}, this.clasificacion);
      let nombreSinEspacios = this.modificarForm.controls['nombre'].value.trim();
      clasificacion.nombre = nombreSinEspacios;
      clasificacion.activo = this.modificarForm.get('activo').value;

      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en las clasificaciones actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
        this.modificarClasificacionSubscription = this.clasificacionService.modificarClasificacion(clasificacion.id, clasificacion).subscribe(
          clasificacion => {
            this.notifier.notify('success', 'Se ha modificado la clasificación correctamente');
            this.bsModalRef.hide();
            this.clasificacionModificadaEvent.emit(clasificacion);
          },
          error => {
            this.notifier.notify('error', 'El nombre modificado ya existe');
          }
        );
      })
    }
  }




  
}