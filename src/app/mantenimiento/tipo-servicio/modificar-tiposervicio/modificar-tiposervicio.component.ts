import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { TipoServicioService } from 'src/app/shared/tiposervicio.service';
import { TipoServicio } from 'src/model/tiposervicio.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-tiposervicio',
  templateUrl: './modificar-tiposervicio.component.html',
  styleUrls: ['./modificar-tiposervicio.component.css']
})
export class ModificarTipoServicioComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private modalService: BsModalService,
    private tipoServicioService: TipoServicioService
  ) { }

  @Output() tipoServicioModificarEvent = new EventEmitter();

  estados: boolean;
  servicio: TipoServicio;
  servicios: TipoServicio[] = []
  modificarForm: FormGroup;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombre': new FormControl(this.servicio.nombre, Validators.required),
      'activo': new FormControl(this.servicio.activo, Validators.required)
    })
  }

  onSubmit(form: any){
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombre'].value)){
      this.servicio.nombre = this.modificarForm.get("nombre").value;
      this.servicio.activo = this.modificarForm.get('activo').value;
    }
    this.bsModalRef.hide();
    this.tipoServicioModificarEvent.emit();
  }

}
