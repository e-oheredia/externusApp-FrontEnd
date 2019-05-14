import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegionService } from 'src/app/shared/region.service';
import { NotifierService } from 'angular-notifier';
import { Region } from 'src/model/region.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DiaLaborable } from 'src/model/dialaborable.model';
import { DiaLaborableService } from 'src/app/shared/dialaborable.service';
import { UtilsService } from 'src/app/shared/utils.service';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-modificar-region',
  templateUrl: './modificar-region.component.html',
  styleUrls: ['./modificar-region.component.css']
})
export class ModificarRegionComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private regionService: RegionService,
    private notifier: NotifierService,
  ) { }

  @Output() regionModificadaEvent = new EventEmitter();

  dialaborable: DiaLaborable;
  diaslaborables: DiaLaborable[] = [];
  region: Region;
  modificarForm: FormGroup;
  modificarRegionSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'diaslaborables': new FormArray([])
    }, this.atLeastOne);
    this.construirForm();
  }

  construirForm() {
    this.region.diasLaborables.sort((a, b) => a.id - b.id).forEach(dia => {
      (<FormArray>this.modificarForm.controls['diaslaborables']).
        push(new FormGroup({
          'id': new FormControl(dia.id, Validators.required),
          'nombre': new FormControl(dia.dia.nombre, Validators.required),
          'activo': new FormControl(dia.activo, Validators.required),
          'horaini': new FormControl({value: dia.activo == 0  ? null: dia.inicio, disabled: dia.activo == 0}, Validators.required),
          'horafin': new FormControl({value: dia.activo == 0 ? null: dia.fin, disabled: dia.activo == 0}, Validators.required)
        }))
      })
    console.log(this.modificarForm)
  }

  validarAlMenosUnActivo(form: any): boolean {
    console.log(this.modificarForm.value);
    let diaActivo = (<Array<DiaLaborable>>this.modificarForm.value.diaslaborables).find(dialaborable => dialaborable.activo == true || dialaborable.activo == 1);
    if (this.utilsService.isUndefinedOrNullOrEmpty(diaActivo)) {
      return false;
    } else {
      return true;
    }
  }

  atLeastOne(form: FormGroup): { [key: string]: boolean } | null {

    if ((<Array<DiaLaborable>>form.value.diaslaborables).findIndex(dialaborable => dialaborable.activo == true || dialaborable.activo == 1) > -1) {
      return null;
    }

    return {'atLeastOneActiveRequired': true}
  }

  onSubmit(form: any) {
    if (!this.validarAlMenosUnActivo(form)) {
      this.notifier.notify('warning', 'Al menos un día debe estar activo');
    }
    this.region.diasLaborables.forEach(dia => {

      let diaCambiado = this.modificarForm.value.diaslaborables.find(dia2 => dia2.id === dia.id);
      dia.activo = diaCambiado.activo;
      dia.inicio = diaCambiado.horaini ? diaCambiado.horaini : dia.inicio;
      dia.fin = diaCambiado.horafin ? diaCambiado.horafin : dia.fin;

      if (dia.activo == true) {
        dia.activo = 1
      }
      if (dia.activo == false) {
        dia.activo = 0
      }
    })

    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: 'Modificar horario',
        mensaje: "¿Está seguro de guardar los cambios?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.regionService.modificarRegion(this.region.id, this.region).subscribe(
        region => {
          this.notifier.notify('success', 'Se ha modificado el horario correctamente');
          this.bsModalRef.hide();
          this.regionModificadaEvent.emit(region);
        },
        error => {
          if (error.status === 400){
            this.notifier.notify('error', error.error.message);
          }
        }  
        // error => {
        //   this.notifier.notify('error', 'NO SE PUEDE MODIFICAR, LLAMA A ORLA');
        // }
      )
      console.log(this.modificarForm)
    })
  }



  desactivarDias(diaLaborableGroup: FormGroup) {

    if (diaLaborableGroup.controls['activo'].value === 0 || diaLaborableGroup.controls['activo'].value === false) {

      diaLaborableGroup.controls['horaini'].reset();
      diaLaborableGroup.controls['horafin'].reset();
      diaLaborableGroup.controls['horaini'].disable();
      diaLaborableGroup.controls['horafin'].disable();


    } else {

      diaLaborableGroup.controls['horaini'].enable();
      diaLaborableGroup.controls['horafin'].enable();

    }
  }

}
