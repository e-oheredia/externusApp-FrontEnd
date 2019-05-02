import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { GuiaService } from 'src/app/shared/guia.service';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Guia } from 'src/model/guia.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-guiabloque',
  templateUrl: './modificar-guiabloque.component.html',
  styleUrls: ['./modificar-guiabloque.component.css']
})
export class ModificarGuiabloqueComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  @Output() modificarGuiaBloqueEvent = new EventEmitter();

  guia: Guia;
  guias: Guia[] = [];
  modificarForm: FormGroup;

  modificarGuiaBloqueSubscription: Subscription;

  ngOnInit() {
    this.modificarForm = new FormGroup({
      'numeroGuia' : new FormControl(this.guia.numeroGuia, Validators.required)
    })
  }

  onSubmit(form: any){
    if (this.modificarForm.controls['numeroGuia'].value.length !== 0){
      this.guia.numeroGuia = this.modificarForm.controls['numeroGuia'].value;
      console.log(this.guia)
      this.modificarGuiaBloqueSubscription = this.guiaService.modificarGuia(this.guia).subscribe(
        guia => {
          this.notifier.notify('success', 'Se modificó la guía con éxito');
          this.bsModalRef.hide();
          this.modificarGuiaBloqueEvent.emit(guia);
        },
        error => {
          this.notifier.notify('error', 'El número modificado ya existe');
        }
      );
    }
  }


}
