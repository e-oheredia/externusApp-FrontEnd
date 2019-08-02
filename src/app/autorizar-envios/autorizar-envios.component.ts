import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DocumentoService } from '../shared/documento.service';
import { EnvioService } from '../shared/envio.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Envio } from 'src/model/envio.model';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { ModificarEnvioComponent } from './modificar-envio/modificar-envio.component';

@Component({
  selector: 'app-autorizar-envios',
  templateUrl: './autorizar-envios.component.html',
  styleUrls: ['./autorizar-envios.component.css']
})
export class AutorizarEnviosComponent implements OnInit {
  source : LocalDataSource;

  constructor(
    private envioService: EnvioService,
    public documentoService: DocumentoService,
    private notifier: NotifierService,
    private modalService: BsModalService,
  ) { 
    this.source = new LocalDataSource(this.data);

  }

  dataEnviosPendientesDeAutorizacion: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  envios: Envio[] = [];
  envio: Envio;
  enviosNoAutorizadosSubscription: Subscription;
  envioForm: FormGroup;
  data: any[] = [];

  ngOnInit() {
    this.generarColumnas();
    this.listarEnviosNoAutorizados();
    this.settings.hideSubHeader = false;
  }

  generarColumnas() {
    this.settings.columns = {
      remitente: {
        title: 'Remitente'
      },
      area: {
        title: 'Área'
      },
      clasificacion: {
        title: 'Clasificación'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      tipoSeguridad: {
        title: 'Tipo de seguridad'
      },
      plazoDistribucion: {
        title: 'Plazo de distribución'
      },
      fechaCreacion: {
        title: 'Fecha de creación'
      },
      cantidadDocumentos: {
        title: 'Cantidad de documentos'
      },
      buttonDescargarPermiso: {
        title: 'Adjunto',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-download";
          instance.mostrarData.subscribe(row => {
            let envio = this.envios.find(envio => envio.id == row.id)
            instance.ruta = envio.rutaAutorizacion
          });

        }
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificar(row);
          });
        }
      },
      buttonAutorizar: {
        title: 'Autorizar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-check";
          instance.pressed.subscribe(row => {
            this.autorizar(row);
          });
        }
      },
      buttonDenegar: {
        title: 'Denegar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-times";
          instance.pressed.subscribe(row => {
            this.denegar(row);
          });
        }
      },
    }
  }

  listarEnviosNoAutorizados() {
    this.dataEnviosPendientesDeAutorizacion.reset();
    this.envioService.listarEnviosNoAutorizados().subscribe(
      envios => {
        this.envios = envios;
        let dataEnviosPendientesDeAutorizacion = [];
        envios.forEach(
          envio => {
            dataEnviosPendientesDeAutorizacion.push({
              id: envio.id,
              remitente: envio.buzon.nombre,
              area: envio.buzon.area.nombre,
              clasificacion: envio.clasificacion.nombre,
              tipoServicio: envio.tipoServicio.nombre,
              tipoSeguridad: envio.tipoSeguridad.nombre,
              plazoDistribucion: envio.plazoDistribucion.nombre,
              fechaCreacion: this.documentoService.getFechaCreacion(envio.documentos[0]),
              cantidadDocumentos: envio.documentos.length
            })
          }
        )
        this.dataEnviosPendientesDeAutorizacion.load(dataEnviosPendientesDeAutorizacion);
        this.data=dataEnviosPendientesDeAutorizacion;
      }
    )
  }

  modificar(row) {
    this.envio = this.envios.find(envio => envio.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarEnvioComponent, {
      initialState: {
        id: this.envio.id,
        envio: this.envio,
        titulo: 'Modificar envío'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.modificarEnvioEvent.subscribe(() =>
    this.listarEnviosNoAutorizados()
    )
  }

  autorizar(row) {
    this.envio = this.envios.find(envio => envio.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        id: this.envio.id,
        envio: this.envio,
        mensaje: "¿Está seguro que desea autorizar el envío?"
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.envioService.autorizarEnvio(this.envio.id).subscribe(
        () => {
          this.notifier.notify('success', 'Se ha autorizado correctamente el envío');
          this.listarEnviosNoAutorizados();
        },
        error => {
          console.log(error);
        }
      )   
    });
  }

  denegar(row) {
    this.envio = this.envios.find(envio => envio.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: "¿Está seguro que desea denegar el envío?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.envioService.denegarEnvio(this.envio.id).subscribe(
        () => {
          this.notifier.notify('success', 'Se ha denegado correctamente el envío');
          this.listarEnviosNoAutorizados();
        },
        error => {
          console.log(error);
        }
      )
    });
  }






}
