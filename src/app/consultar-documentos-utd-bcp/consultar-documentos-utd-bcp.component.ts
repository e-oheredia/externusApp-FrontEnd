import { Component, OnInit } from '@angular/core';
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
import { SeguimientoDocumento } from 'src/model/seguimientodocumento.model';

@Component({
  selector: 'app-consultar-documentos-utd-bcp',
  templateUrl: './consultar-documentos-utd-bcp.component.html',
  styleUrls: ['./consultar-documentos-utd-bcp.component.css']
})
export class ConsultarDocumentosUtdBcpComponent implements OnInit {
  source: LocalDataSource;

  constructor(
    public documentoService: DocumentoService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    public envioService: EnvioService,
    private tituloService: TituloService
  ) { }

  dataTodosLosDocumentos: LocalDataSource = new LocalDataSource();
  documentoForm: FormGroup;
  documentosSubscription: Subscription;
  settings = AppSettings.tableSettings;
  documentos: Documento[] = [];
  documento: Documento;
  data: any[] = [];

  mySettings = {}

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
        title: 'Plazo de distribución'
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
      clasificacion: {
        title: 'Clasificación'
      },
      estadodoc: {
        title: 'Estado del documento'
      },
      estadopro: {
        title: 'Estado de distribución'
      },
      motivo: {
        title: 'Motivo'
      },
      documentodevuelto: {
        title: 'Documento devuelto'
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
      },
      guia: {
        title: 'Guía'
      },
      imagen: {
        title: 'Imagen',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          if (this.documentos.length > 0) {
            instance.mostrarData.subscribe(row => {
              let documentoElegido = this.documentos.find(documento => documento.documentoAutogenerado === row.autogenerado)
              let seguimientosOrdenados = documentoElegido.seguimientosDocumento.sort((a, b) => b.id - a.id)
              let seguimientodocumento: SeguimientoDocumento = seguimientosOrdenados[0]
              let ruta_imagen: any;
              if (seguimientodocumento.linkImagen === null) {
                ruta_imagen = " ";
                instance.claseIcono = " "
              } else {
                instance.claseIcono = "fa fa-eye";
                ruta_imagen = seguimientodocumento.linkImagen;
              }
              instance.ruta = ruta_imagen;
            })
          }
        }
      },
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
              clasificacion: documento.envio.clasificacion ? documento.envio.clasificacion.nombre : "no tiene",
              estadodoc: this.documentoService.getUltimoEstado(documento).nombre,
              estadopro: this.documentoService.getEstadoResultadoProveedor(documento) ? this.documentoService.getEstadoResultadoProveedor(documento).nombre : " ",
              motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : "",
              documentodevuelto: documento.tiposDevolucion ? documento.tiposDevolucion.map(tipodevolucion => tipodevolucion.nombre).join(", ") : " ",
              autorizado: this.envioService.getUltimoSeguimientoAutorizacion(documento.envio) ? this.envioService.getUltimoSeguimientoAutorizacion(documento.envio).estadoAutorizado.nombre : "APROBADA",
              fechaCreacion: this.documentoService.getFechaCreacion(documento),
              fechaEnvio: this.documentoService.getFechaEnvio(documento) ? this.documentoService.getFechaEnvio(documento) : " ",
              fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento),
              codigodevolucion: documento.codigoDevolucion,
              guia: documento.numeroGuia ? documento.numeroGuia : ' '
            })
            this.documentos.push(documento);
            this.dataTodosLosDocumentos.load(dataTodosLosDocumentos);
            this.data = dataTodosLosDocumentos;
            this.documentoForm.controls['codigo'].setValue('');
            this.documentoForm.controls['fechaIni'].reset();
            this.documentoForm.controls['fechaFin'].reset();
            this.documentoForm.controls['fechaIni'].enable();
            this.documentoForm.controls['fechaFin'].enable();
            this.notifier.notify('success', 'Código autogenerado encontrado');
          },
          error => {
            if (error.status === 400) {
              this.documentos = [];
              this.notifier.notify('error', 'No hay resultados');
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
                      clasificacion: documento.envio.clasificacion ? documento.envio.clasificacion.nombre : "no tiene",
                      estadodoc: this.documentoService.getUltimoEstado(documento).nombre,
                      estadopro: this.documentoService.getEstadoResultadoProveedor(documento) ? this.documentoService.getEstadoResultadoProveedor(documento).nombre : " ",
                      motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre : " ",
                      documentodevuelto: documento.tiposDevolucion ? documento.tiposDevolucion.map(tipodevolucion => tipodevolucion.nombre).join(", ") : " ",
                      autorizado: this.envioService.getUltimoSeguimientoAutorizacion(documento.envio) ? this.envioService.getUltimoSeguimientoAutorizacion(documento.envio).estadoAutorizado.nombre : "APROBADA",
                      fechaCreacion: this.documentoService.getFechaCreacion(documento),
                      fechaEnvio: this.documentoService.getFechaEnvio(documento) ? this.documentoService.getFechaEnvio(documento) : " ",
                      fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento),
                      codigodevolucion: documento.codigoDevolucion,
                      guia: documento.numeroGuia ? documento.numeroGuia : ' '
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
              this.notifier.notify('error', 'Rango de fechas no válido');
            }
          }
        );
    }

    else {
      this.notifier.notify('error', 'Ingrese algún dato de consulta');
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



  exportar() {
    this.documentoService.exportarDocumentos(this.documentos)
  }

}
