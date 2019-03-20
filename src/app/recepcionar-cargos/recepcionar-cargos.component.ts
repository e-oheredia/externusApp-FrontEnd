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
import { AsignarCodigoCargoComponent } from './asignar-codigo/asignar-codigo.component';

@Component({
  selector: 'app-recepcionar-cargos',
  templateUrl: './recepcionar-cargos.component.html',
  styleUrls: ['./recepcionar-cargos.component.css']
})


export class RecepcionarCargosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService, 
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private tituloService: TituloService) { }

  dataCargosPendientes: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;  
  documentos: Documento[] = [];
  documento: Documento;

  documentosSubscription: Subscription;
  documentoForm: FormGroup;



  ngOnInit() {
    this.documentoForm = new FormGroup({ 
      codigo: new FormControl('', Validators.required) });
    this.tituloService.setTitulo("Recepción de Cargos");
    this.generarColumnas();
    this.listarCargosPendientes();
  }

  generarColumnas(){
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
        renderComponent : ButtonViewComponent,
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
          this.asignarCodigoCargo(row);
        });
        }
      }
    }
  }


  listarCargosPendientes() {
    this.dataCargosPendientes.reset();
    this.documentosSubscription = this.documentoService.listarDocumentosEntregados().subscribe(
      documentos => {
        this.documentos = documentos;
        let dataCargosPendientes = [];
        documentos.forEach(
          documento => {
            dataCargosPendientes.push({
              id: documento.id,
              autogenerado: documento.documentoAutogenerado,
              remitente: documento.envio.buzon.nombre,
              areaRemitente: documento.envio.buzon.area.nombre,
              fechaEntrega: this.documentoService.getSeguimientoDocumentoByEstadoId(documento, 4) ? this.documentoService.getSeguimientoDocumentoByEstadoId(documento,4).fecha : "sin fecha",
              recepcionado: documento.recepcionado ? 'SI' : 'NO'
            });
          });
        this.dataCargosPendientes.load(dataCargosPendientes);
      }
    )
  }


  recepcionarCargo() {

    if (this.documentoForm.controls['codigo'].value.length !== 0) {

      let documento = this.documentos.find(documentoList => documentoList.documentoAutogenerado === this.documentoForm.controls['codigo'].value);

      if (documento === undefined) {
        this.notifier.notify('error', 'NO SE HA ENCONTRADO EL CODIGO INGRESADO');
      } else if (this.documentoForm.controls['codigo'].value.length !== 0) {
        this.documentoService.recepcionarCargo(documento.id).subscribe(
          documentos => {
            this.documentos = this.documentos
            this.notifier.notify('success', 'CARGO RECEPCIONADO');
            this.documentoForm.controls['codigo'].setValue('');
            this.listarCargosPendientes();
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


  asignarCodigoCargo(row){
    this.documento = this.documentos.find(documento => documento.id == row.id)

    let bsModalRef: BsModalRef = this.modalService.show(AsignarCodigoCargoComponent, {
      initialState: {        
        documento: this.documento,
      },
      class: "modal-md",
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.codigoAsignadoEvent.subscribe(() =>
    this.listarCargosPendientes()
    )
  }


}

