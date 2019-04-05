import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { Clasificacion } from 'src/model/clasificacion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modificar-clasificacion',
  templateUrl: './modificar-clasificacion.component.html',
  styleUrls: ['./modificar-clasificacion.component.css']
})
export class ModificarClasificacionComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService
  ) { }

  @Output() clasificacionModificadaEvent = new EventEmitter();

  estados: boolean;
  clasificacion: Clasificacion;
  clasificaciones: Clasificacion[] = [];
  modificarForm: FormGroup;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre' : new FormControl(this.clasificacion.nombre, Validators.required),
      'activo' : new FormControl(this.clasificacion.activo, Validators.required)
    })
  }

  onSubmit(form: any){
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)){
      this.clasificacion.nombre = this.modificarForm.get("nombre").value;
      this.clasificacion.activo = this.modificarForm.get('activo').value;
    }
    this.bsModalRef.hide();
    this.clasificacionModificadaEvent.emit();
  }

}
