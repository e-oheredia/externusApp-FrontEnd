import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../shared/documento.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Documento } from 'src/model/documento.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { RecepcionarDocumentoComponent } from './recepcionar-documento/recepcionar-documento.component';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { AsignarCodigoDevolucionComponent } from './asignar-codigo/asignar-codigo.component';

@Component({
  selector: 'app-recepcionar-devueltos',
  templateUrl: './recepcionar-devueltos.component.html',
  styleUrls: ['./recepcionar-devueltos.component.css']
})
export class RecepcionarDevueltosComponent implements OnInit {

  constructor(
    private documentoService: DocumentoService,
    private modalService: BsModalService,
    private notifier: NotifierService
  ) { }

  dataDocumentosConResultadosYRecepcionados: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  documentos: Documento[] = [];
  documento: Documento;

  documentosSubscription: Subscription;
  documentoForm: FormGroup;

  ngOnInit() {
    this.documentoForm = new FormGroup({
      autogenerado: new FormControl('', Validators.required)
    });
    this.generarColumnas();
    this.listarDocumentosConResultadosYRecepcionados();
    this.settings.hideSubHeader = false;
  }

  generarColumnas() {
    this.settings.columns = {
      autogenerado: {
        title: 'Autogenerado'
      },
      remitente: {
        title: 'Remitente'
      },
      area: {
        title: 'Área del remitente'
      },
      fechaEntrega: {
        title: 'Fecha de entrega'
      },
      estado: {
        title: 'Estado'
      },
      motivo: {
        title: 'Motivo'
      },
      fisicosDevueltos: {
        title: 'Físicos devueltos'
      },
      buttonAsignar: {
        title: 'Asignar código de devolución',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          if (this.documentos.length > 0) {
            instance.mostrarData.subscribe(row => {
              let docu = this.documento = this.documentos.find(documento => documento.documentoAutogenerado == row.autogenerado);
              let estadito = this.documentoService.getUltimoEstado(docu)
              if (estadito.id == EstadoDocumentoEnum.RECEPCIONADO) {
                instance.claseIcono = "fas fa-edit";
              }
            });
          }
          instance.pressed.subscribe(row => {
            this.asignarCodigoDevolucion(row);
          });
        }
      },
    }
  }


  listarDocumentosConResultadosYRecepcionados() {
    this.documentosSubscription = this.documentoService.listarDocumentosConResultadosYRecepcionados().subscribe(
      documentos => {
        this.documentos = documentos;
        let dataDocumentosConResultadosYRecepcionados = [];
        documentos.forEach(
          documento => {
            dataDocumentosConResultadosYRecepcionados.push({
              autogenerado: documento.documentoAutogenerado,
              remitente: documento.envio.buzon.nombre,
              area: documento.envio.buzon.area.nombre,
              fechaEntrega: this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4) ? this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4).fecha : this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 5) ? this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 5).fecha : "sin fecha",
              estado: this.documentoService.getUltimoEstado(documento).nombre,
              motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : "",
              fisicosDevueltos: documento.tiposDevolucion.sort((a,b) => a.id - b.id).map(tipoDevolucion => tipoDevolucion.nombre).join(", ")
            })
          }
        )
        this.dataDocumentosConResultadosYRecepcionados.load(dataDocumentosConResultadosYRecepcionados);
      }
    )
  }


  recepcionarDocumento(autogenerado) {
    if (autogenerado.length !== 0) {
      let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === autogenerado);
      if (documento === undefined) {
        this.notifier.notify('error', 'No se ha encontrado el código ingresado');
      } else if (autogenerado !== 0) {
        let estadito = this.documentoService.getUltimoEstado(documento).id
        if (estadito !== EstadoDocumentoEnum.RECEPCIONADO) {
          let bsModalRef: BsModalRef = this.modalService.show(RecepcionarDocumentoComponent, {
            initialState: {
              documento: documento,
              estado: this.documentoService.getUltimoEstado(documento).nombre,
              titulo: 'Recepcionar documento'
            },
            class: "modal-md",
            keyboard: false,
            backdrop: "static"
          });
          this.documentoForm.reset();
          bsModalRef.content.documentoRecepcionadoEvent.subscribe(() =>
            this.listarDocumentosConResultadosYRecepcionados()
          )
        } else {
          this.notifier.notify('error', 'El documento ya se encuentra recepcionado');
          this.documentoForm.reset();
        }
      }
    }
    else {
      this.notifier.notify('error', 'Ingrese el autogenerado del documento');
    }
  }



  asignarCodigoDevolucion(row) {
    this.documento = this.documentos.find(documento => documento.documentoAutogenerado == row.autogenerado)

    let bsModalRef: BsModalRef = this.modalService.show(AsignarCodigoDevolucionComponent, {
      initialState: {
        documento: this.documento,
        titulo: 'Asignar código'
      },
      class: "modal-md",
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.codigoAsignadoEvent.subscribe(() =>
      this.listarDocumentosConResultadosYRecepcionados()
    )
  }


  exportar(){
    this.documentoService.exportarDevoluciones(this.documentos)
  }























  // recepcionarDocumento(autogenerado) {

  //   if (autogenerado.length !== 0) {
  //     let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === autogenerado);

  //     if (documento === undefined) {
  //       this.notifier.notify('error', 'No se ha encontrado el código ingresado');
  //     } else if (autogenerado !== 0) {
  //       if(documento.recepcionado!=true){



  //         this.documentoService.recepcionarDocumento(documento.id).subscribe(
  //           documento => {
  //             this.notifier.notify('success', 'Documento recepcionado');
  //             this.documentoForm.controls['autogenerado'].setValue('');
  //             this.listarDocumentosConResultadosYRecepcionados();
  //           },
  //           error => {
  //             if (error.status === 404) {
  //               this.documentos = [];
  //               this.notifier.notify('error', 'Error en back no mapeado');
  //             }
  //           }
  //         );
  //       }else{
  //         this.notifier.notify('error', 'El documento ya se encuentra recepcionado');
  //       }
  //     }
  //   }
  //   else {
  //     this.notifier.notify('error', 'Código vacío');
  //   }
  // }


}
