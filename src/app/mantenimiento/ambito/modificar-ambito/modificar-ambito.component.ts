import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegionService } from 'src/app/shared/region.service';
import { Region } from 'src/model/region.model';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';
import { Ambito } from 'src/model/ambito.model';

@Component({
  selector: 'app-modificar-ambito',
  templateUrl: './modificar-ambito.component.html',
  styleUrls: ['./modificar-ambito.component.css']
})
export class ModificarAmbitoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private ambitoService: AmbitoService,
    private regionService: RegionService
  ) { }

  @Output() ambitoModificadoEvent = new EventEmitter();

  estados: boolean;
  ambito: Ambito;
  ambitos: Ambito[] = [];
  regiones: Region[];
  modificarForm: FormGroup; 

  regionesSubscription: Subscription;
  modificarAmbitoSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.ambito.nombre, Validators.required),
      'region': new FormControl(null, Validators.required),
      'activo': new FormControl(this.ambito.activo, Validators.required)
    });
    this.cargarDatosVista();
  }

  cargarDatosVista(){
    this.regiones = this.regionService.getRegiones();

    if(this.regiones){
      this.modificarForm.get("region").setValue(this.regiones.find(region => this.ambito.region.id === region.id));
    }
    this.regionesSubscription = this.regionService.regionesChanged.subscribe(
      regiones => {
        this.regiones = regiones;
        this.modificarForm.get("region").setValue(this.regiones.find(region => this.ambito.region.id === region.id));
      }
    )
  }


  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)){
      let ambito = Object.assign({}, this.ambito);
      let nombreSinEspacios = this.modificarForm.controls['nombre'].value.trim();
      ambito.nombre = nombreSinEspacios;
      ambito.region = this.modificarForm.get("region").value;
      ambito.activo = this.modificarForm.get('activo').value;
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en los ámbitos actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
      this.modificarAmbitoSubscription = this.ambitoService.modificarAmbito(ambito.id, ambito).subscribe(
        ambito => {
          this.notifier.notify('success', 'Se ha modificado el ámbito correctamente');
          this.bsModalRef.hide();
          this.ambitoModificadoEvent.emit(ambito);
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
        );
      })
    }
  }

  

}
