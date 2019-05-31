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
export class AsignarCodigoDevolucionComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private documentoService: DocumentoService
  ) { }

  @Output() codigoAsignadoEvent = new EventEmitter<Documento>();

  documento: Documento;
  documentos: Documento[] = [];
  AsignarForm: FormGroup;
  AsignarCodigoDevueltoSubscription: Subscription;

  ngOnInit() {
    this.AsignarForm = new FormGroup({
      'codigoDevolucion' : new FormControl('', Validators.required)
    });
  }

  onSubmit(codigoFormValue){
    if (this.AsignarForm.controls['codigoDevolucion'].value.length !== 0){
      let documento: Documento = new Documento();
      documento.id = this.documento.id;
      documento.codigoDevolucion = codigoFormValue.codigoDevolucion;
      this.AsignarCodigoDevueltoSubscription = this.documentoService.asignarCodigoDevolucionCargo(documento.id, documento.codigoDevolucion).subscribe(
        documento => {
          this.notifier.notify('success', 'Se asigno el código correctamente');
          this.bsModalRef.hide();
          this.codigoAsignadoEvent.emit(documento);
        },
        error => {
          this.notifier.notify('error', error.error.mensaje);
        }
      );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el código de devolución');
    }
  }




}
