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

  ngOnInit() {
    this.cargarDatosVista();
    this.modificarForm = new FormGroup ({
      'nombre' : new FormControl(this.plazo.nombre, Validators.required),
      'tiempoEnvio' : new FormControl(this.plazo.tiempoEnvio, Validators.required),
      'tipoPlazoDistribucion' : new FormControl(this.plazo.tipoPlazoDistribucion.nombre, Validators.required),
      'activo' : new FormControl(this.plazo.activo ,Validators.required)
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

  onSubmit(form: any){
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['tiempoEnvio'].value && !this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['tipoPlazoDistribucion'].value))){
      this.plazo.nombre = this.modificarForm.get("nombre").value;
      this.plazo.tiempoEnvio = this.modificarForm.get("tiempoEnvio").value;
      this.plazo.tipoPlazoDistribucion = this.modificarForm.get('tipoPlazoDistribucion').value;
      this.plazo.activo = this.modificarForm.get('activo').value;
    }
    this.bsModalRef.hide();
    this.confirmarEvent.emit();
  }
  
  
}
