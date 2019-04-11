import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { Documento } from 'src/model/documento.model';
import { DocumentoService } from 'src/app/shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asignar-codigo',
  templateUrl: './asignar-codigo.component.html',
  styleUrls: ['./asignar-codigo.component.css']
})
export class AsignarCodigoDocumentoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private documentoService: DocumentoService) { }

    @Output() codigoAsignadoEvent = new EventEmitter<Documento>();

  documento: Documento;
  documentos: Documento[] = [];
  AsignarForm: FormGroup;
  AsignarCodigoDocumentoSubscription: Subscription;

  ngOnInit() {
    this.AsignarForm = new FormGroup({
      'codigoDevDocumento' : new FormControl('', Validators.required)
    });
  }

  onSubmit(codigoFormValue){
    if (this.AsignarForm.controls['codigoDevDocumento'].value.length !== 0){
      let documento: Documento = new Documento();
      documento.id = this.documento.id;
      documento.codigoDevolucion = codigoFormValue.codigoDevDocumento;
      this.AsignarCodigoDocumentoSubscription = this.documentoService.asignarCodigoDevolucionCargo(documento.id, documento.codigoDevolucion).subscribe(
        documento => {
          this.notifier.notify('success', 'Se asignó el código correctamente');
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
