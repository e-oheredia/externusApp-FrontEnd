import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { DocumentoService } from 'src/app/shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoDocumento } from 'src/model/estadodocumento.model';
import { MotivoEstado } from 'src/model/motivoestado.model';
import { TipoDevolucion } from 'src/model/tipodevolucion.model';
import { TipoDevolucionService } from 'src/app/shared/tipodevolucion.service';

@Component({
  selector: 'app-recepcionar-documento',
  templateUrl: './recepcionar-documento.component.html',
  styleUrls: ['./recepcionar-documento.component.css']
})
export class RecepcionarDocumentoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private documentoService: DocumentoService,
    private tipoDevolucionService: TipoDevolucionService
  ) { }

  @Output() documentoRecepcionadoEvent = new EventEmitter<Documento>();

  documento: Documento;
  estado: EstadoDocumento;
  motivo: MotivoEstado;
  recepcionarForm: FormGroup;
  tiposDevolucion: TipoDevolucion[];
  tiposDevolucionIniciales: TipoDevolucion[];

  recepcionarDocumentoSubscription: Subscription;

  ngOnInit() {
    this.recepcionarForm = new FormGroup({
      'autogenerado': new FormControl(this.documento.documentoAutogenerado, Validators.required),
      'estado': new FormControl(this.documentoService.getUltimoEstado(this.documento).nombre, Validators.required),
      'motivo': new FormControl(this.documentoService.getUltimoSeguimientoDocumento(this.documento).motivoEstado.nombre, Validators.required),
      'devoluciones': new FormArray([])
    }, this.validarDevolucion.bind(this)
    )

    this.listarTiposDevolucion();

    setTimeout(() => {
      document.getElementById("recepcionarBoton").focus();
    }, 200)

  }

  listarTiposDevolucion() {
    this.tiposDevolucionIniciales = this.documentoService.getUltimoEstado(this.documento).tiposDevolucion;
    this.tiposDevolucion = this.tipoDevolucionService.getTiposDevolucion();

    if (this.tiposDevolucion) {
      this.tiposDevolucion.forEach(devolucion => {
        const control = new FormControl(this.tiposDevolucionIniciales.findIndex(devolucionDocumento => devolucionDocumento.id === devolucion.id) > -1);
        (<FormArray>this.recepcionarForm.get('devoluciones')).push(control);
      });
    }

    this.tipoDevolucionService.tiposDevolucionChanged.subscribe(
      tiposDevolucion => {
        this.tiposDevolucion = tiposDevolucion;
        tiposDevolucion.forEach(devolucion => {
          const control = new FormControl(this.tiposDevolucionIniciales.findIndex(devolucionDocumento => devolucionDocumento.id === devolucion.id) > -1);
          (<FormArray>this.recepcionarForm.get('devoluciones')).push(control);
        })
      }
    )

  }

  onSubmit(form: any) {
    let documento: Documento = new Documento();
    documento = this.documento;
    documento.id = this.documento.id;
    documento.tiposDevolucion = this.documentoService.getUltimoEstado(this.documento).tiposDevolucion;

    this.recepcionarDocumentoSubscription = this.documentoService.recepcionarDocumento(documento.id, documento.tiposDevolucion).subscribe(
      documento => {
        this.notifier.notify('success', 'Documento recepcionado');
        this.bsModalRef.hide();
        this.documentoRecepcionadoEvent.emit(documento);
      },
      error => {
        this.notifier.notify('error', error.error);
      }
    );
  }




  onChangeTipoDevolucionElegida(event: any, tipoDevolucion: TipoDevolucion) {
    event.srcElement.checked ? this.tiposDevolucionIniciales.push(tipoDevolucion) : this.tiposDevolucionIniciales.splice(this.tiposDevolucionIniciales.indexOf(this.tiposDevolucionIniciales.find(devolucion => devolucion.id === tipoDevolucion.id)), 1);
  }



  validarDevolucion(form: FormGroup): { [key: string]: boolean } | null {
    if (form.value.devoluciones.findIndex(devolucion => devolucion === true) > -1) {
      return null;
    }
    return { 'ingreseDevolucion': true }
  }


}
