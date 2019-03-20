import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoService } from '../shared/documento.service';
import { Documento } from 'src/model/documento.model';
import { NotifierService } from 'angular-notifier';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from '../shared/utils.service';
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { AsignarCodigoDocumentoComponent } from './asignar-codigo/asignar-codigo.component';

@Component({
  selector: 'app-recepcionar-documentos',
  templateUrl: './recepcionar-documentos.component.html',
  styleUrls: ['./recepcionar-documentos.component.css']
})
export class RecepcionarDocumentosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService) { }

  dataDocumentosPendientes: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  documentos: Documento[] = [];
  documento: Documento;

  documentosSubscription: Subscription;
  documentoForm: FormGroup;



  ngOnInit() {
    this.documentoForm = new FormGroup({
      codigo: new FormControl('', Validators.required)
    });
    this.generarColumnas();
    this.listarDocumentosPendientes();
  }

  generarColumnas() {
    this.settings.columns = {
      autogenerado: {
        title: 'Autogenerado'
      },
      remitente: {
        title: 'Remitente'
      },
      areaRemitente: {
        title: 'Área remitente'
      },
      fechaEntrega: {
        title: 'Fecha de entrega'
      },
      recepcionado: {
        title: 'Recepcionado'
      },
      buttonAsignar: {
        title: 'Código de devolución',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction : (instance : any) => {
          if(this.documentos.length > 0){
            instance.mostrarData.subscribe(row => {
              let docu = this.documento = this.documentos.find(documento => documento.id == row.id);
              if (docu.recepcionado === true){
                instance.claseIcono = "fas fa-edit";
              }              
            });
          }
          instance.pressed.subscribe(row => {       
          this.asignarCodigoDocumento(row);
        });
        }
      }
    }
  }

  listarDocumentosPendientes() {
    this.documentosSubscription = this.documentoService.listarDocumentosPorDevolver().subscribe(
      documentos => {
        this.documentos = documentos;
        let dataDocumentosPendientes = [];
        documentos.forEach(
          documento => {
            dataDocumentosPendientes.push({
              id: documento.id,
              autogenerado: documento.documentoAutogenerado,
              remitente: documento.envio.buzon.nombre,
              areaRemitente: documento.envio.buzon.area.nombre,
              fechaEntrega: this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 5) ? this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 5).fecha : this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 6) ? this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 6).fecha : "sin fecha",
              recepcionado: documento.recepcionado ? 'SI' : 'NO'
            });
          });
        this.dataDocumentosPendientes.load(dataDocumentosPendientes);
      }
    )
  }


  recepcionarDocumento(codigo) {

    if (codigo.length !== 0) {

      let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === codigo);

      if (documento === undefined) {
        this.notifier.notify('error', 'NO SE HA ENCONTRADO EL CODIGO INGRESADO');
      } else if (codigo !== 0) {
        this.documentoService.recepcionarDocumento(documento.id).subscribe(
          documento => {
            this.notifier.notify('success', 'DOCUMENTO RECEPCIONADO');
            this.documentoForm.controls['codigo'].setValue('');
            this.listarDocumentosPendientes();
          },
          error => {
            if (error.status === 404) {
              this.documentos = [];
              this.notifier.notify('error', 'ERROR EN BACK NO MAPEADO');
            }
          }
        );
      }

    }
    else {
      this.notifier.notify('error', 'CODIGO VACIO');
      console.log(this.documentoForm.controls['codigo'].value);
    }
  }

  asignarCodigoDocumento(row) {
    this.documento = this.documentos.find(documento => documento.id == row.id)

    let bsModalRef: BsModalRef = this.modalService.show(AsignarCodigoDocumentoComponent, {
      initialState: {
        documento: this.documento,
        titulo: 'Asignar código'
      },
      class: "modal-md",
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.codigoAsignadoEvent.subscribe(() =>
      this.listarDocumentosPendientes()
    )
  }


}
