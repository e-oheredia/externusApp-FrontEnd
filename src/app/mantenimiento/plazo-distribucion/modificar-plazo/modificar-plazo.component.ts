import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoPlazoDistribucion } from 'src/model/tipoplazodistribucion.model';
import { TipoPlazoDistribucionService } from 'src/app/shared/tipoplazodistribucion.service';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-modificar-plazo',
  templateUrl: './modificar-plazo.component.html',
  styleUrls: ['./modificar-plazo.component.css']
})
export class ModificarPlazoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private plazoDistribucionService: PlazoDistribucionService,
    private tipoPlazosService: TipoPlazoDistribucionService,
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  tiposPlazos: TipoPlazoDistribucion[];
  estados: boolean;
  plazo: PlazoDistribucion;
  plazos: PlazoDistribucion[] = [];
  modificarForm: FormGroup;

  tiposPlazosSubscription: Subscription;
  modificarTipoPlazosSubscription: Subscription;

  ngOnInit() {
    
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.plazo.nombre, Validators.required),
      'tiempoEnvio': new FormControl(this.plazo.tiempoEnvio, Validators.required),
      'tipoPlazoDistribucion': new FormControl(null, Validators.required),
      'activo': new FormControl(this.plazo.activo, Validators.required)
    });
    this.cargarDatosVista();
  }

  cargarDatosVista() {
    this.tiposPlazos = this.tipoPlazosService.getTiposPlazosDistribucion();

    if (this.tiposPlazos) {
      this.modificarForm.get("tipoPlazoDistribucion").setValue(this.tiposPlazos.find(tipoPlazo => this.plazo.tipoPlazoDistribucion.id === tipoPlazo.id));
    }

    this.tiposPlazosSubscription = this.tipoPlazosService.tiposPlazosDistribucionChanged.subscribe(
      tiposPlazos => {
        this.tiposPlazos = tiposPlazos;
        this.modificarForm.get("tipoPlazoDistribucion").setValue(this.tiposPlazos.find(tipoPlazo => this.plazo.tipoPlazoDistribucion.id === tipoPlazo.id));
      
        }
    )
  }

  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['tiempoEnvio'].value && !this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['tipoPlazoDistribucion'].value))) {
      let nombreSinEspacios = this.modificarForm.controls['nombre'].value.trim();
      this.plazo.nombre = nombreSinEspacios;
      this.plazo.tiempoEnvio = this.modificarForm.get("tiempoEnvio").value;
      this.plazo.tipoPlazoDistribucion = this.modificarForm.get('tipoPlazoDistribucion').value;
      this.plazo.activo = this.modificarForm.get('activo').value;

      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en los plazos actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
      this.modificarTipoPlazosSubscription = this.plazoDistribucionService.modificarPlazoDistribucion(this.plazo.id,this.plazo).subscribe(
        plazo => {
          this.notifier.notify('success', 'Se ha modificado el plazo de distribución correctamente');
          this.bsModalRef.hide();
          this.confirmarEvent.emit();
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
        );
      })
    }
  }


}
