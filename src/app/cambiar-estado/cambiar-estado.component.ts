import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../shared/documento.service';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Documento } from 'src/model/documento.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MensajeExitoComponent } from '../modals/mensaje-exito/mensaje-exito.component';
import { SeguimientoDocumento } from 'src/model/seguimientodocumento.model';
import { EstadoDocumento } from 'src/model/estadodocumento.model';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { EstadoDocumentoService } from '../shared/estadodocumento.service';

@Component({
  selector: 'app-cambiar-estado',
  templateUrl: './cambiar-estado.component.html',
  styleUrls: ['./cambiar-estado.component.css']
})
export class CambiarEstadoComponent implements OnInit {

  constructor(
    private estadoService: EstadoDocumentoService,
    public documentoService: DocumentoService,
    public bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private utilsService: UtilsService,
    public modalService: BsModalService,
  ) { }

  documentoForm: FormGroup;
  estadoForm: FormGroup;
  validado: boolean;
  estadoActualDocumento: number;
  documentoSubscription: Subscription;
  documento: Documento;
  estadoDocumentoEnum: EstadoDocumentoEnum;
  seguimientoDocumento: SeguimientoDocumento;
  estados: EstadoDocumento[];
  nuevosEstados: EstadoDocumento[];

  estadosSubscription: Subscription;

  ngOnInit() {
    this.cargarVista();
    this.documentoForm = new FormGroup({
      "id": new FormControl('', Validators.required)
    })
    this.estadoForm = new FormGroup({
      "estadoDocumento": new FormControl(null, Validators.required),
      "observacion": new FormControl('', Validators.required)
    })

  }


  buscarCodigoDocumento() {
    if (this.documentoForm.controls['id'].value.length !== 0) {
      this.documentoSubscription = this.documentoService.listarDocumentoPorCodigo(this.documentoForm.controls['id'].value)
        .subscribe(
          documento => {
            this.documento = documento;
            this.documentoForm.controls['id'].reset();
            this.estadoForm.controls['observacion'].reset();
            this.notifier.notify('success', 'Código autogenerado encontrado');
            this.cargarCombo(this.documentoService.getUltimoEstado(documento).id);
            this.estadoActualDocumento = this.documentoService.getUltimoEstado(documento).id;
            if (documento.documentosGuia.length === 0 || documento.documentosGuia[0].validado === false || documento.documentosGuia.length === 0) {
              this.validado = false;
            } else {
              this.validado = true;
            }
          },
          error => {
            if (error.status === 400) {
              this.notifier.notify('error', 'El código del documento no existe');
            }
          }
        );
    }
    else {
      this.notifier.notify('error', 'Debe ingresar el código del documento');
    }

  }

  cargarVista() {
    this.estados = this.estadoService.getEstadosDocumento();

    this.estadosSubscription = this.estadoService.estadosDocumentoChanged.subscribe(
      estados => {
        this.estados = estados;
      }
    )
  }


  cargarCombo(estadoId) {
    this.nuevosEstados = this.estados.find(estado =>
      estado.id === estadoId).estadosDocumentoPermitidos;
  }


  desvalidar(id) {
    this.documentoService.desvalidar(id).subscribe(
      () => {
        this.estadoForm.reset();

        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState: {
            mensaje: "Se ha desvalidado el documento"
          }
        });
        this.bsModalRef.hide();

      }
    )


  }


  cambiarEstado(form: any) {
    let seguimientoDocumento = new SeguimientoDocumento();
    seguimientoDocumento.estadoDocumento = form.get('estadoDocumento').value;
    seguimientoDocumento.observacion = form.get('observacion').value;
    this.seguimientoDocumento = seguimientoDocumento;

    this.documentoService.cambiarEstado(this.documento.id, this.seguimientoDocumento).subscribe(
      () => {

        this.documento = null;

        let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
          initialState: {
            mensaje: "SE MODIFICÓ EL ESTADO DEL DOCUMENTO EXITOSAMENTE"
          }
        });
        this.estadoForm.reset();
        this.bsModalRef.hide();
      }
    )
  }








}
