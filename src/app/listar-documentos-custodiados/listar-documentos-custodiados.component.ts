import { AppSettings } from './../shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Documento } from '../../model/documento.model';
import { DocumentoService } from '../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listar-documentos-custodiados',
  templateUrl: './listar-documentos-custodiados.component.html',
  styleUrls: ['./listar-documentos-custodiados.component.css']
})
export class ListarDocumentosCustodiadosComponent implements OnInit {

  constructor(
    private documentoService: DocumentoService
  ) { }

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
    tipoDocumento: {
      title: 'Tipo de Documento'
    },
    tipoServicio: {
      title: 'Tipo de Servicio'
    },
    tipoSeguridad: {
      title: 'Tipo de Seguridad'
    },
    plazoDistribucion: {
      title: 'Plazo de Distribución'
    },
    razonSocial : {
      title: 'Razón Social'
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
      title: 'Fecha de Creación'
    }

  };

  ngOnInit() {
    this.tableSettings.columns = this.columnsDocumentosCustodiados; 
    this.tableSettings.hideSubHeader = false;
    this.listarDocumentoCustodiados();
  }

  listarDocumentoCustodiados(){
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
              tipoDocumento: documentoCustodiado.envio.tipoDocumento.nombre,
              tipoServicio: documentoCustodiado.envio.tipoServicio.nombre,
              tipoSeguridad: documentoCustodiado.envio.tipoSeguridad.nombre,
              plazoDistribucion: documentoCustodiado.envio.plazoDistribucion.nombre,
              razonSocial: documentoCustodiado.razonSocialDestino,
              contacto: documentoCustodiado.contactoDestino,
              direccion: documentoCustodiado.direccion,
              autorizado: documentoCustodiado.envio.autorizado ? 'Sí' : 'No',
              fechaCreacion: this.documentoService.getFechaCreacion(documentoCustodiado)
            })
        })
        this.dataDocumentosCustodiados.load(dataDocumentosCustodiados);
        return;
      }       
    )
  }
}
