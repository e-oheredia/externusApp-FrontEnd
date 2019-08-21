import { AppSettings } from './../shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Documento } from '../../model/documento.model';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EnvioService } from '../shared/envio.service';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@Component({
  selector: 'app-listar-documentos-custodiados',
  templateUrl: './listar-documentos-custodiados.component.html',
  styleUrls: ['./listar-documentos-custodiados.component.css']
})
export class ListarDocumentosCustodiadosComponent implements OnInit {

  constructor(
    private documentoService: DocumentoService,
    private envioService: EnvioService
  ) { }

  documento: Documento;
  documentosCustodiados: Documento[] = [];
  listarDocumentosCustodiadosSubscription: Subscription;
  dataDocumentosCustodiados: LocalDataSource = new LocalDataSource();
  tableSettings = AppSettings.tableSettings;

  columnsDocumentosCustodiados = {
    codigo: {
      title: 'Código'
    },
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
    razonSocial: {
      title: 'Razón social'
    },
    contacto: {
      title: 'Contacto'
    },
    direccion: {
      title: 'Dirección'
    },
    autorizado: {
      title: 'Autorizado'
    },
    fechaCreacion: {
      title: 'Fecha de creación'
    }
  };

  ngOnInit() {
    this.tableSettings.columns = this.columnsDocumentosCustodiados;
    this.tableSettings.hideSubHeader = false;
    this.listarDocumentoCustodiados();
  }

  listarDocumentoCustodiados() {
    this.dataDocumentosCustodiados.reset();
    this.listarDocumentosCustodiadosSubscription = this.documentoService.listarDocumentosCustodiados().subscribe(
      documentosCustodiados => {
        this.documentosCustodiados = documentosCustodiados;
        let dataDocumentosCustodiados = [];
        documentosCustodiados.forEach(
          documentoCustodiado => {
            dataDocumentosCustodiados.push({
              codigo: documentoCustodiado.documentoAutogenerado,
              remitente: documentoCustodiado.envio.buzon.nombre,
              area: documentoCustodiado.envio.buzon.area.nombre,
              clasificacion: documentoCustodiado.envio.clasificacion.nombre,
              tipoServicio: documentoCustodiado.envio.tipoServicio.nombre,
              tipoSeguridad: documentoCustodiado.envio.tipoSeguridad.nombre,
              plazoDistribucion: documentoCustodiado.envio.plazoDistribucion.nombre,
              razonSocial: documentoCustodiado.razonSocialDestino,
              contacto: documentoCustodiado.contactoDestino,
              direccion: documentoCustodiado.direccion,
              autorizado: this.envioService.getUltimoSeguimientoAutorizacion(documentoCustodiado.envio) ? this.envioService.getUltimoSeguimientoAutorizacion(documentoCustodiado.envio).estadoAutorizado.nombre : "APROBADA",
              fechaCreacion: this.documentoService.getFechaCreacion(documentoCustodiado)
            })
          })
        this.dataDocumentosCustodiados.load(dataDocumentosCustodiados);
        return;
      }
    )
  }
}
