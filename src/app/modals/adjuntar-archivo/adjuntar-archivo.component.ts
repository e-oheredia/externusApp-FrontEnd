import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoService } from 'src/app/shared/documento.service';
import { Documento } from 'src/model/documento.model';

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
  ) { }



  @Output() confirmarEvent = new EventEmitter<File>();

  documento: Documento;
  guiaForm: FormGroup;
  archivoAdjunto: File;

  mensaje: string;
  titulo: string;
  textoAceptar: string = "Aceptar";
  textoCancelar: string ="Cancelar";
  tipoArchivo: string = ".xlsx";

  ngOnInit() {
    this.guiaForm = new FormGroup({
      'archivoAdjunto' : new FormControl(null, Validators.required)
    })
  }

  onChangeExcelFile(file: File){
    this.archivoAdjunto = file;
  }

  onSubmit(archivoAdjunto: File) {
    if (this.utilsService.isUndefinedOrNull(archivoAdjunto)) {
      this.notifier.notify("success","Seleccione el archivo excel a subir");
      return;
    }
    this.subirResutados(archivoAdjunto);
  }

  subirResutados(file: File){
    this.documentoService.mostrarResultadosDocumentosProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)){
        this.documentoService.subirReporte(data).subscribe(
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

  //   if (this.guiaForm.get('archivo') === null || this.guiaForm.get('archivo').value === "" || this.guiaForm.get('archivo').value === null) {
  //     this.notifier.notify('error', 'Debe seleccionar un archivoo');
  //     return;
  //   }

  //   this.documentoService.subirReporte(this.documento).subscribe(
  //     () => {
  //       let bsModalRef: BsModalRef = this.modalService.show(MensajeExitoComponent, {
  //         initialState: {
  //           mensaje: "El reporte fue subido correctamente"
  //         }
  //       });
  //       this.bsModalRef.hide();
  //     }
  //   )
  // }

  // onChangeExcelFile(file: File) {
  //   if (file == undefined || file == null) {
  //     this.archivoAdjunto = null;
  //     return;
  //   }
  //   if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
  //     this.archivoAdjunto = null;
  //     this.notifier.notify('error', 'Error, el archivo debe ser un Excel');
  //     return null;
  //   }
  //   this.archivoAdjunto = file;
  // }

  


}
