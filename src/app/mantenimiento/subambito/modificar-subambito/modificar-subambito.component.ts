import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { SubAmbitoService } from 'src/app/shared/subambito.service';
import { SubAmbito } from 'src/model/subambito.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { Ambito } from 'src/model/ambito.model';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-modificar-subambito',
  templateUrl: './modificar-subambito.component.html',
  styleUrls: ['./modificar-subambito.component.css']
})
export class ModificarSubambitoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private subambitoService: SubAmbitoService,
    private ambitoService: AmbitoService
  ) { }

  @Output() subambitoModificadoEvent = new EventEmitter();

  estados: boolean;
  subambito: SubAmbito;
  subambitos: SubAmbito[] = [];
  ambitos: Ambito[];
  modificarForm: FormGroup; 

  ambitosSubscription: Subscription;
  modificarSubAmbitoSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.subambito.nombre, Validators.required),
      'ambito': new FormControl(null, Validators.required),
      'activo': new FormControl(this.subambito.activo, Validators.required)
    });
    this.cargarDatosVista();
  }

  cargarDatosVista(){
    this.ambitos = this.ambitoService.getAmbitos();
    if(this.ambitos){
      this.modificarForm.get("ambito").setValue(this.ambitos.find(ambito => this.subambito.ambito.id === ambito.id));
    }
    this.ambitosSubscription = this.ambitoService.ambitosChanged.subscribe(
      ambitos => {
        this.ambitos = ambitos;
        this.modificarForm.get("ambito").setValue(this.ambitos.find(ambito => this.subambito.ambito.id === ambito.id));
      }
    )
  }


  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)){
      let nombreSinEspacios = this.modificarForm.controls['nombre'].value.trim();
      this.subambito.nombre = nombreSinEspacios;
      this.subambito.ambito = this.modificarForm.get("ambito").value;
      this.subambito.activo = this.modificarForm.get('activo').value;
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en los ámbitos actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
      this.modificarSubAmbitoSubscription = this.subambitoService.modificarSubAmbito(this.subambito.id, this.subambito).subscribe(
        subambito => {
          this.notifier.notify('success', 'Se ha modificado el subambito correctamente');
          this.bsModalRef.hide();
          this.subambitoModificadoEvent.emit(subambito);
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
        );
      })
    }
  }

  

}
