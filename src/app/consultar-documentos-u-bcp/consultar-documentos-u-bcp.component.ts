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

@Component({
    selector: 'app-consultar-documentos-u-bcp',
    templateUrl: './consultar-documentos-u-bcp.component.html',
    styleUrls: ['./consultar-documentos-u-bcp.component.css']
})

export class ConsultarDocumentosUBCPComponent implements OnInit {

    constructor(
        public documentoService: DocumentoService,
        private modalService: BsModalService,
        private tituloService: TituloService,
        private notifier: NotifierService,
        private utilsService: UtilsService,
        private envioService: EnvioService
    ) { }

    dataTodosMisDocumentos: LocalDataSource = new LocalDataSource();
    settings = AppSettings.tableSettings;
    documentos: Documento[] = [];
    documento: Documento;

    documentosSubscription: Subscription;
    documentoForm: FormGroup;

    ngOnInit() {
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
        })
        this.generarColumnas();
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
            estado: {
                title: 'Estado'
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
            // link: {
            //     title: 'link'
            // },
        }
    }

    listarDocumentos(fechaIni: Date, fechaFin: Date) {

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            this.documentosSubscription = this.documentoService.listarDocumentosUsuarioBCP(fechaIni, fechaFin).subscribe(
                documentos => {
                    this.documentos = documentos;

                    this.dataTodosMisDocumentos.reset();
                    this.documentoService.listarDocumentosUsuarioBCP(this.documentoForm.controls['fechaIni'].value, this.documentoForm.controls['fechaFin'].value).subscribe(
                        documentos => {
                            this.documentos = documentos;
                            let dataTodosMisDocumentos = [];
                            documentos.forEach(
                                documento => {
                                    dataTodosMisDocumentos.push({
                                        autogenerado: documento.documentoAutogenerado,
                                        nroDocumento: documento.nroDocumento,
                                        plazo: documento.envio.plazoDistribucion.nombre ? documento.envio.plazoDistribucion.nombre : "no tiene",
                                        razonSocial: documento.razonSocialDestino ? documento.razonSocialDestino : "no tiene",
                                        contactoDestino: documento.contactoDestino,
                                        direccion: documento.direccion,
                                        distrito: documento.distrito.nombre,
                                        estado: this.documentoService.getUltimoEstado(documento).nombre,
                                        fisicoRecibido: documento.recepcionado ? "SI" : "NO",
                                        autorizado: documento.envio.autorizado ? "SI" : "NO",
                                        fechaCreacion: this.documentoService.getFechaCreacion(documento),
                                        fechaEnvio: this.documentoService.getFechaCreacion(documento),
                                        fechaUltimoResultado: this.documentoService.getUltimaFechaEstado(documento)
                                        //IMAGEN
                                    })
                                }
                            )
                            this.dataTodosMisDocumentos.load(dataTodosMisDocumentos);
                        }
                    )
                },
                error => {
                    if (error.status === 400) {
                        this.documentos = [];
                        this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
                    }
                }
            );
        }
        else {
            this.notifier.notify('error', 'SELECCIONE RANGO DE FECHAS');
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