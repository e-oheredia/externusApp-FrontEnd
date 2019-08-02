import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { EnvioService } from '../shared/envio.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from '../shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Documento } from 'src/model/documento.model';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { TrackingDocumentoComponent } from '../modals/tracking-documento/tracking-documento.component';
import * as moment from "moment-timezone";
import { BuzonService } from '../shared/buzon.service';
import { Buzon } from 'src/model/buzon.model';

@Component({
    selector: 'app-consultar-documentos-u-bcp',
    templateUrl: './consultar-documentos-u-bcp.component.html',
    styleUrls: ['./consultar-documentos-u-bcp.component.css']
})

export class ConsultarDocumentosUBCPComponent implements OnInit {
    source : LocalDataSource;

    constructor(
        public documentoService: DocumentoService,
        private modalService: BsModalService,
        private tituloService: TituloService,
        private notifier: NotifierService,
        private utilsService: UtilsService,
        private envioService: EnvioService,
        private buzonService: BuzonService
    ) {     

    }

    dataTodosMisDocumentos: LocalDataSource = new LocalDataSource();
    settings = AppSettings.tableSettings;
    documentos: Documento[] = [];
    documento: Documento;
    buzon: Buzon;
    data: any[] = [];

    documentosSubscription: Subscription;
    buzonSubscription: Subscription;
    documentoForm: FormGroup;

    ngOnInit() {
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
            "fechaFin": new FormControl(moment().format('YYYY-MM-DD'), Validators.required)
        })
        this.generarColumnas();

        this.buzonSubscription = this.buzonService.buzonActualChanged.subscribe(() => {
            this.listarDocumentos();
            this.source = new LocalDataSource(this.data);          
        });

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
            nroDocumento: {
                title: 'Nro de documento'
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
            contactoDestino: {
                title: 'Contacto Destino'
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
            estadodocumento: {
                title: 'Estado del documento'
            },
            motivo: {
                title: 'Motivo'
            },
            documentodevuelto: {
                title: 'Documento Devuelto'
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

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            this.documentosSubscription = this.documentoService.listarDocumentosUsuarioBCP(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value).subscribe(
                documentos => {
                    this.documentos = documentos;

                    this.dataTodosMisDocumentos.reset();
                    this.documentoService.listarDocumentosUsuarioBCP(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value).subscribe(
                        documentos => {
                            this.documentos = documentos;
                            let dataTodosMisDocumentos = [];
                            let fecha_envio: any;
                            documentos.forEach(
                                documento => {
                                    dataTodosMisDocumentos.push({
                                        autogenerado: documento.documentoAutogenerado,
                                        nroDocumento: documento.nroDocumento,
                                        producto: documento.envio.producto.nombre,
                                        plazo: documento.envio.plazoDistribucion.nombre ? documento.envio.plazoDistribucion.nombre : " ",
                                        razonSocial: documento.razonSocialDestino ? documento.razonSocialDestino.toUpperCase() : " ",
                                        contactoDestino: documento.contactoDestino.toUpperCase(),
                                        direccion: documento.direccion.toUpperCase(),
                                        distrito: documento.distrito.nombre.toUpperCase(),
                                        clasificacion: documento.envio.clasificacion ? documento.envio.clasificacion.nombre : " ",
                                        estadodocumento: this.documentoService.getUltimoEstado(documento).nombre,
                                        motivo: this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado ? this.documentoService.getUltimoSeguimientoDocumento(documento).motivoEstado.nombre.toUpperCase() : " ",
                                        documentodevuelto: documento.tiposDevolucion ? documento.tiposDevolucion.map(tipodevolucion => tipodevolucion.nombre).join(", ") : " ",
                                        autorizado: this.envioService.getUltimoSeguimientoAutorizacion(documento.envio) ? this.envioService.getUltimoSeguimientoAutorizacion(documento.envio).estadoAutorizado.nombre : "APROBADA" ,
                                        fechaCreacion: this.documentoService.getFechaCreacion(documento),
                                        fechaEnvio: this.documentoService.getFechaEnvio(documento) ? this.documentoService.getFechaEnvio(documento) : " ",
                                        fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento),
                                        codigodevolucion: documento.codigoDevolucion
                                    })
                                }
                            )
                            this.dataTodosMisDocumentos.load(dataTodosMisDocumentos);
                            this.data=dataTodosMisDocumentos;

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
            this.notifier.notify('error', 'Seleccione un rango de fechas');
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

    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }


}