import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { DocumentoService } from 'src/app/shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asignar-codigo',
  templateUrl: './asignar-codigo.component.html',
  styleUrls: ['./asignar-codigo.component.css']
})
export class AsignarCodigoCargoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private documentoService: DocumentoService) { }

  @Output() codigoAsignadoEvent = new EventEmitter<Documento>();

  documento: Documento;
  documentos: Documento[] = [];
  AsignarForm: FormGroup;
  AsignarCodigoCargoSubscription: Subscription;

  ngOnInit() {
    this.AsignarForm = new FormGroup({
      'codigoDevCargo' : new FormControl('', Validators.required)
    });
  }

  onSubmit(codigoFormValue){
    if (this.AsignarForm.controls['codigoDevCargo'].value.length !== 0){
      let documento: Documento = new Documento();
      documento.id = this.documento.id;
      documento.codigoDevolucion = codigoFormValue.codigoDevCargo;
      this.AsignarCodigoCargoSubscription = this.documentoService.asignarCodigoDevolucionCargo(documento.id, documento.codigoDevolucion).subscribe(
        documento => {
          this.notifier.notify('success', 'SE ASIGNÓ EL CÓDIGO CORRECTAMENTE');
          this.bsModalRef.hide();
          this.codigoAsignadoEvent.emit(documento);
        },
        error => {
          this.notifier.notify('error', error.error.mensaje);
        }
      );
    }
    else {
      this.notifier.notify('error', 'DEBE INGRESAR EL CODIGO DE DEVOLUCIÓN');
    }
  }



}
