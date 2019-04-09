import { Component, OnInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { EnvioService } from '../shared/envio.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Documento } from 'src/model/documento.model';
import { TituloService } from '../shared/titulo.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TrackingDocumentoComponent } from '../modals/tracking-documento/tracking-documento.component';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@Component({
  selector: 'app-consultar-documentos-utd-bcp',
  templateUrl: './consultar-documentos-utd-bcp.component.html',
  styleUrls: ['./consultar-documentos-utd-bcp.component.css']
})
export class ConsultarDocumentosUtdBcpComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    public envioService: EnvioService,
    private tituloService: TituloService) { }


  dataTodosLosDocumentos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  documentos: Documento[] = [];
  documento: Documento;

  documentosSubscription: Subscription;
  documentoForm: FormGroup;


  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      "codigo": new FormControl('', Validators.required)
    })
    this.tituloService.setTitulo("UTD - Consultar Documentos2");
    this.generarColumnas();
    this.listarDocumentos();
    this.settings.hideSubHeader = false;
  }

  generarColumnas() {
    this.settings.columns = {
      linkTracking: {
        title: 'Tracking',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-clipboard-list";
          instance.pressed.subscribe(row => {
            this.visualizarSeguimiento(row);
          })
        }
      },
      autogenerado: {
        title: 'Autogenerado'
      },
      remitente: {
        title: 'Remitente'
      },
      producto: {
        title: 'Producto'
      },
      plazo: {
        title: 'Plazo distribución'
      },
      razonSocial: {
        title: 'Razón social'
      },
      contacto: {
        title: 'Contacto destino'
      },
      direccion: {
        title: 'Dirección'
      },
      distrito: {
        title: 'Distrito'
      },
      estado: {
        title: 'Estado'
      },
      motivo: {
        title: 'Motivo'
      },
      fisicoRecibido: {
        title: 'Físico recibido'
      },
      autorizado: {
        title: 'Autorizado'
      },
      fechaCreacion: {
        title: 'Fecha creación'
      },
      fechaEnvio: {
        title: 'Fecha envío'
      },
      fechaUltimoResultado: {
        title: 'Fecha último resultado'
      },
      codigodevolucion: {
        title: 'Código de devolución'
      }
    }
  }

  listarDocumentos() {
    if (this.documentoForm.controls['codigo'].value.length !== 0) {

      this.documentosSubscription = this.documentoService.listarDocumentosUtdBCPCodigo(this.documentoForm.controls['codigo'].value)
        .subscribe(
          documento => {
            this.documentos = []
            let dataTodosLosDocumentos = [];
            dataTodosLosDocumentos.push({
              autogenerado: documento.documentoAutogenerado,
              producto: documento.envio.producto.nombre,
              remitente: documento.envio.buzon.nombre,
              plazo: documento.envio.plazoDistribucion.nombre ? documento.envio.plazoDistribucion.nombre : "no tiene",
              razonSocial: documento.razonSocialDestino ? documento.razonSocialDestino : "no tiene",
              contacto: documento.contactoDestino,
              direccion: documento.direccion,
              distrito: documento.distrito.nombre,
              estado: this.documentoService.getUltimoEstado(documento).nombre,
              motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado,
              fisicoRecibido: documento.recepcionado ? "SI" : "NO",
              autorizado: documento.envio.autorizado ? "SI" : "NO",
              fechaCreacion: this.documentoService.getFechaCreacion(documento),
              fechaEnvio: this.documentoService.getFechaEnvio(documento) ? this.documentoService.getFechaEnvio(documento) : "-",
              fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento),
              codigodevolucion: documento.codigoDevolucion
            })
            this.documentos.push(documento);
            this.dataTodosLosDocumentos.load(dataTodosLosDocumentos);
            this.documentoForm.controls['codigo'].setValue('');
            this.documentoForm.controls['fechaIni'].reset();
            this.documentoForm.controls['fechaFin'].reset();
            this.documentoForm.controls['fechaIni'].enable();
            this.documentoForm.controls['fechaFin'].enable();
            this.notifier.notify('success', 'CÓDIGO AUTOGENERADO ENCONTRADO');
          },
          error => {
            if (error.status === 400) {
              this.documentos = [];
              this.notifier.notify('error', 'NO HAY RESULTADOS');
            }
          }
        );
    }

    else if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

      this.documentosSubscription = this.documentoService.listarDocumentosUtdBCPFechas(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value)
        .subscribe(
          documentos => {
            this.documentos = documentos
            this.documentoForm.controls['codigo'].enable();

            this.dataTodosLosDocumentos.reset();
            this.documentoService.listarDocumentosUtdBCPFechas(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value).subscribe(
              documentos => {
                this.documentos = documentos;
                let dataTodosLosDocumentos = [];
                documentos.forEach(
                  documento => {
                    dataTodosLosDocumentos.push({
                      autogenerado: documento.documentoAutogenerado,
                      producto: documento.envio.producto.nombre,
                      remitente: documento.envio.buzon.nombre,
                      plazo: documento.envio.plazoDistribucion.nombre ? documento.envio.plazoDistribucion.nombre : "no tiene",
                      razonSocial: documento.razonSocialDestino ? documento.razonSocialDestino : "no tiene",
                      contacto: documento.contactoDestino ? documento.contactoDestino : "no tiene",
                      direccion: documento.direccion,
                      distrito: documento.distrito.nombre,
                      estado: this.documentoService.getUltimoEstado(documento).nombre,
                      motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : "",
                      fisicoRecibido: documento.recepcionado ? "SI" : "NO",
                      autorizado: documento.envio.autorizado ? "SI" : "NO",
                      fechaCreacion: this.documentoService.getFechaCreacion(documento),
                      fechaEnvio: this.documentoService.getFechaCreacion(documento), //ACTUALIZAR FECHA
                      fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento),
                      codigodevolucion: documento.codigoDevolucion
                    })
                  }
                )
                this.dataTodosLosDocumentos.load(dataTodosLosDocumentos);
              }
            )
          },
          error => {
            if (error.status === 400) {
              this.documentos = [];
              this.notifier.notify('error', 'RANGO DE FECHA NO VÁLIDA');
            }
          }
        );
    }

    else {
      this.notifier.notify('error', 'INGRESE ALGÚN DATO DE CONSULTA');
    }
  }


  visualizarSeguimiento(row) {
    let bsModalRef: BsModalRef = this.modalService.show(TrackingDocumentoComponent, {
      initialState: {
        documento: this.documentos.find(documento => documento.documentoAutogenerado == row.autogenerado)
      },
      class: 'modal-lg',
      keyboard: false,
      backdrop: "static"
    });
  }

  desactivarFechas(codigo) {
    if (codigo.length === 0) {
      this.documentoForm.controls['fechaIni'].enable();
      this.documentoForm.controls['fechaFin'].enable();
    } else {
      this.documentoForm.controls['fechaIni'].disable();
      this.documentoForm.controls['fechaFin'].disable();
    }
  }


  desactivarCodigo(fechaIni, fechaFin) {
    if (this.utilsService.isUndefinedOrNullOrEmpty(fechaIni) && this.utilsService.isUndefinedOrNullOrEmpty(fechaFin)) {
      this.documentoForm.controls['codigo'].enable();
    } else {
      this.documentoForm.controls['codigo'].disable();
    }
  }



  ngOnDestroy() {
    this.documentosSubscription.unsubscribe();
  }

}
