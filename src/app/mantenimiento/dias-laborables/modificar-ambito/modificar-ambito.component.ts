import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { NotifierService } from 'angular-notifier';
import { Ambito } from 'src/model/ambito.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DiaLaborable } from 'src/model/dialaborable.model';
import { DiaLaborableService } from 'src/app/shared/dialaborable.service';
import { UtilsService } from 'src/app/shared/utils.service';

@Component({
  selector: 'app-modificar-ambito',
  templateUrl: './modificar-ambito.component.html',
  styleUrls: ['./modificar-ambito.component.css']
})
export class ModificarAmbitoComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private bsModalRef: BsModalRef,
    private ambitoService: AmbitoService,
    private notifier: NotifierService,
  ) { }

  @Output() ambitoModificadoEvent = new EventEmitter();

  dialaborable: DiaLaborable;
  diaslaborables: DiaLaborable[] = [];
  ambito: Ambito;
  modificarForm: FormGroup;
  modificarAmbitoSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'diaslaborables': new FormArray([])
    });
    this.construirForm();
  }

  construirForm() {
    this.ambito.diasLaborables.sort((a,b) => a.id - b.id).forEach(dia => {
      (<FormArray>this.modificarForm.controls['diaslaborables']).
        push(new FormGroup({
          'id': new FormControl(dia.id, Validators.required),
          'nombre': new FormControl(dia.dia.nombre, Validators.required),
          'activo': new FormControl(dia.activo, Validators.required),
          'horaini': new FormControl(dia.inicio, Validators.required),
          'horafin': new FormControl(dia.fin, Validators.required)
        }))
    })
    console.log(this.modificarForm)
  }

  validarAlMenosUnActivo(form: any) : boolean {
    console.log(this.modificarForm.value);
    let diaActivo = (<Array<DiaLaborable>>this.modificarForm.value.diaslaborables).find(dialaborable => dialaborable.activo == true || dialaborable.activo == 1);
    if (this.utilsService.isUndefinedOrNullOrEmpty(diaActivo)){
      return false;
    } else {
      return true;
    }
  }

  onSubmit(form: any) {
    if(!this.validarAlMenosUnActivo(form)){
      this.notifier.notify('warning','Al menos un día debe estar activo');
    }
      this.ambito.diasLaborables.forEach(dia => {

        let diaCambiado = this.modificarForm.value.diaslaborables.find(dia2 => dia2.id === dia.id);
        dia.activo = diaCambiado.activo;
        dia.inicio = diaCambiado.horaini;
        dia.fin = diaCambiado.horafin;

        if (dia.activo == true) {
          dia.activo = 1
        }
        if (dia.activo == false) {
          dia.activo = 0
        }
      })
      
      this.ambitoService.modificarAmbito(this.ambito.id, this.ambito).subscribe(
        ambito => {
          this.notifier.notify('success', 'Se ha modificado el ambito correctamente');
          this.bsModalRef.hide();
          this.ambitoModificadoEvent.emit(ambito);
        },
        error => {
          this.notifier.notify('error', 'NO SE PUEDE MODIFICAR, LLAMA A ORLA');
        }
      )
      console.log(this.modificarForm)

  }


  desactivarDias(activo){
    if (!this.utilsService.isUndefinedOrNullOrEmpty(activo)){
      this.modificarForm.value.diaslaborables['horaini'].disable();
      this.modificarForm.value.diaslaborables['horaini'].reset();
      // this.modificarForm.controls['diaslaborables'].reset();
      // this.modificarForm.value.diaslaborables['horaini'].reset();
      // this.modificarForm.value.diaslaborables['horaini'].disable();
      // this.modificarForm.value.diaslaborables['horafin'].reset();
      // this.modificarForm.value.diaslaborables['horafin'].disable();
    } else {
      this.modificarForm.value.diaslaborables['horaini'].enable();
      this.modificarForm.value.diaslaborables['horafin'].enable();
    }
  }

}
