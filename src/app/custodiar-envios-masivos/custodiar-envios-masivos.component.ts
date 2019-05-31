import { CustodiarDocumentosMasivoModalComponent } from './custodiar-documentos-masivo-modal/custodiar-documentos-masivo-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EnvioMasivoService } from '../shared/enviomasivo.service';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { AppSettings } from '../shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { EnvioMasivo } from '../../model/enviomasivo.model';

@Component({
  selector: 'app-custodiar-envios-masivos',
  templateUrl: './custodiar-envios-masivos.component.html',
  styleUrls: ['./custodiar-envios-masivos.component.css'],
  entryComponents: [
    CustodiarDocumentosMasivoModalComponent
  ]
})
export class CustodiarEnviosMasivosComponent implements OnInit {

  constructor(
    private envioMasivoService: EnvioMasivoService,
    public documentoService: DocumentoService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private notifier: NotifierService
  ) { }
  dataEnvios: LocalDataSource = new LocalDataSource();
  enviosMasivosCreados = [];
  masivoAutogenerado = "";
  settings = AppSettings.tableSettings;
  enviosmasivo: EnvioMasivo[] = [];
  envio:EnvioMasivo;
  ngOnInit() {
    this.generarColumnas(),
    this.listarSinCustodiar(),
    this.listarEnviosMasivosPorCustodiar(),
    this.settings.hideSubHeader = false  
  }


  generarColumnas() {
    this.settings.columns = {
      codigo: {
        title: 'Código'
      },
      remitente: {
        title: 'Remitente'
      },
      area: {
        title: 'Área'
      },
      clasificación: {
        title: 'Clasificación'
      },
      servicio: {
        title: 'Tipo de Servicio'
      },
      seguridad: {
        title: 'Tipo de Seguridad'
      },
      distribucion: {
        title: 'Plazo de Distribución'
      },          
      autorizado: {
        title: 'Autorizado'
      },  
      fecha: {
        title: 'Fecha de creación'
      },
      cantidad:{
        title: 'Cantidad de Documentos'
      }          
    }
  }


  listarSinCustodiar(){
    this.dataEnvios.reset();
    this.envioMasivoService.listarEnviosMasivosCreados().subscribe(
      enviosmasivo => {
        this.enviosmasivo = enviosmasivo;
        let dataEnvios = [];
        enviosmasivo.forEach(
          envio => {
            dataEnvios.push({
              codigo: envio.masivoAutogenerado, 
              remitente: envio.buzon.nombre ,
              area: envio.buzon.area.nombre ,
              clasificación:envio.clasificacion.nombre ,
              servicio: envio.tipoServicio.nombre ,
              seguridad: envio.tipoSeguridad.nombre,
              distribucion: envio.plazoDistribucion.nombre ,
              autorizado: this.envioMasivoService.getUltimoSeguimientoAutorizacion(envio) ? this.envioMasivoService.getUltimoSeguimientoAutorizacion(envio).estadoAutorizado.nombre : "APROBADA",
              fecha: this.documentoService.getFechaCreacion(envio.documentos[0]),
              cantidad:envio.documentos.length
            })
          }
        )
        this.dataEnvios.load(dataEnvios);
      }
    )
  }



  listarEnviosMasivosPorCustodiar() {
    this.envioMasivoService.listarEnviosMasivosCreados().subscribe(
      enviosMasivosCreados => {
        this.enviosMasivosCreados = enviosMasivosCreados;
      }
    )
  }

  abrir(masivoAutogenerado: string) {

    let envio = this.enviosMasivosCreados.find(
      envio => envio.masivoAutogenerado === masivoAutogenerado);

    if (this.utilsService.isUndefinedOrNullOrEmpty(envio)) {
      this.notifier.notify('warning', 'No existe el código ingresado');
      return;
    }

    this.masivoAutogenerado = "";

    let bsModalRef: BsModalRef = this.modalService.show(CustodiarDocumentosMasivoModalComponent, {
      initialState: {
        envio: envio
      },
      class: "modal-lg"
    });

    bsModalRef.content.todosDocumentosCustodiadosEvent.subscribe(
      () => {
        this.listarSinCustodiar();
      }
    );
  }

}
