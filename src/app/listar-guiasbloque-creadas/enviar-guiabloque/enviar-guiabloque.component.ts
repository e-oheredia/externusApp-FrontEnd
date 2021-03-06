import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Guia } from 'src/model/guia.model';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GuiaService } from 'src/app/shared/guia.service';
import { NotifierService } from 'angular-notifier';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-enviar-guiabloque',
  templateUrl: './enviar-guiabloque.component.html',
  styleUrls: ['./enviar-guiabloque.component.css']
})
export class EnviarGuiabloqueComponent implements OnInit {

  constructor(
    private guiaService: GuiaService,
    private notifier: NotifierService,
    private bsModalRef: BsModalRef
  ) { }

  @Output() enviarGuiaBloqueEvent = new EventEmitter();

  guia: Guia;
  guias: Guia[] = [];
  enviarForm: FormGroup;

  enviarGuiaBloqueSubscription: Subscription;

  ngOnInit() {
    this.enviarForm = new FormGroup({})
  }

  onSubmit(form: any) {
    let numero = Number(this.guia.id)
    console.log(this.guia)
    this.enviarGuiaBloqueSubscription = this.guiaService.enviarGuiaBloque(numero).subscribe(
      guia => {
        this.notifier.notify('success', 'Se envió la guía con éxito');
        this.bsModalRef.hide();
        this.enviarGuiaBloqueEvent.emit(guia);
      }
    );
  }

}
