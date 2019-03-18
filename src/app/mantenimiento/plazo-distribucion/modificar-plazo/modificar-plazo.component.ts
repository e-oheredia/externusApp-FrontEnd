import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    private plazoDistribucionService: PlazoDistribucionService
  ) { }

  @Output() confirmarEvent = new EventEmitter();

  estados: boolean;
  plazo: PlazoDistribucion;
  plazos: PlazoDistribucion[] = [];
  modificarForm: FormGroup;

  ngOnInit() {
    this.modificarForm = new FormGroup ({
      'nombre' : new FormControl(this.plazo.nombre, Validators.required),
      'tiempoEnvio' : new FormControl(this.plazo.tiempoEnvio, Validators.required),
      'tipoPlazoDistribucion' : new FormControl(this.plazo.tipoPlazoDistribucion.nombre, Validators.required),
      // 'activo' : new FormControl(this.plazos.find(plazo => this.plazo.activo == plazo.activo).activo, Validators.required)
    })
  }

  onSubmit(form: any){
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['tiempoEnvio'].value)){
      this.plazo.nombre = this.modificarForm.get("nombre").value;
      this.plazo.tiempoEnvio = this.modificarForm.get("tiempoEnvio").value;
      this.plazo.tipoPlazoDistribucion = this.modificarForm.get('tipoPlazoDistribucion').value;
      // this.plazo.activo = this.modificarForm.get('activo').value;
    }
    this.bsModalRef.hide();
    this.confirmarEvent.emit();
  }
  
  
}
