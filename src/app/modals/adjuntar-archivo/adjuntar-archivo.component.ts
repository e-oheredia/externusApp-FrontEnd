import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoService } from 'src/app/shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { Guia } from 'src/model/guia.model';
import { GuiaService } from 'src/app/shared/guia.service';

@Component({
  selector: 'app-adjuntar-archivo',
  templateUrl: './adjuntar-archivo.component.html',
  styleUrls: ['./adjuntar-archivo.component.css']
})
export class AdjuntarArchivoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService,
    private documentoService: DocumentoService,
    private guiaService: GuiaService
  ) { }

  @Output() confirmarEvent = new EventEmitter<File>();

  condicion: String;
  documento: Documento;
  guiaForm: FormGroup;
  archivoAdjunto: File;
  guia: Guia;

  mensaje: string;
  titulo: string;
  textoAceptar: string = "Aceptar";
  textoCancelar: string = "Cancelar";
  tipoArchivo: string = ".xlsx";

  ngOnInit() {
    this.guiaForm = new FormGroup({
      'archivoAdjunto': new FormControl(null, Validators.required)
    })
  }

  onChangeExcelFile(file: File) {
    this.archivoAdjunto = file;
  }

  onSubmit(archivoAdjunto: File) {
    if (this.utilsService.isUndefinedOrNull(archivoAdjunto)) {
      this.notifier.notify("success", "Seleccione el archivo excel a subir");
      return;
    }
    this.subirResutados(archivoAdjunto);
  }

  subirResutados(file: File) {
    this.documentoService.validarDevolucionesDelProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.guiaService.subirDocumentosDevolucion(data).subscribe(
          respuesta => {
            this.notifier.notify('success', respuesta.mensaje);
            this.guiaForm.reset();
            this.confirmarEvent.emit();
            this.bsModalRef.hide();
          },
          error => {
            this.notifier.notify('error', error.error.mensaje);
          }
        )
        return;
      }
      this.notifier.notify('error', data.mensaje);
    })
  }




}
