import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EnvioService } from 'src/app/shared/envio.service';
import { NotifierService } from 'angular-notifier';
import { Envio } from 'src/model/envio.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TipoPlazoDistribucionService } from 'src/app/shared/tipoplazodistribucion.service';
import { TipoPlazoDistribucion } from 'src/model/tipoplazodistribucion.model';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { UtilsService } from 'src/app/shared/utils.service';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';

@Component({
  selector: 'app-modificar-envio',
  templateUrl: './modificar-envio.component.html',
  styleUrls: ['./modificar-envio.component.css']
})
export class ModificarEnvioComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private envioService: EnvioService,
    private notifier: NotifierService,
    private utilsService: UtilsService,
    private plazoDistribucionService: PlazoDistribucionService,
    private tipoPlazosService: TipoPlazoDistribucionService
  ) { }

  @Output() modificarEnvioEvent = new EventEmitter();

  envio: Envio;
  plazoDistribucion: PlazoDistribucion;
  plazos: PlazoDistribucion[] = [];
  modificarForm: FormGroup;

  plazosSubscription: Subscription;
  modificarEnvioSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'plazoactual' : new FormControl(this.envio.plazoDistribucion.nombre, Validators.required),
      'plazonuevo' : new FormControl(null, Validators.required)
    });
    this.cargarDatosVista();
  }

  cargarDatosVista() {
    this.plazos = this.plazoDistribucionService.getPlazosDistribucion();
    this.plazosSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
      plazos => {
        this.plazos = plazos;
      }
    )
  }

  onSubmit(form: any){
    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['plazonuevo'].value)){
      let envio = Object.assign({}, this.envio);
      this.plazoDistribucion = this.modificarForm.get('plazonuevo').value;
      
      this.modificarEnvioSubscription = this.envioService.modificarEnvio(envio, this.plazoDistribucion).subscribe(
        envio => {
          this.notifier.notify('success', 'Se modificó el envío con éxito');
          this.bsModalRef.hide();
          this.modificarEnvioEvent.emit(envio);
        },
        error => {
          if (error.status === 400){
            this.notifier.notify('error', error.error.message);
          }
        }  
      );
    }    
  }


}
