import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Documento } from 'src/model/documento.model';
import { DocumentoService } from 'src/app/shared/documento.service';

@Component({
  selector: 'app-tracking-documento',
  templateUrl: './tracking-documento.component.html',
  styleUrls: ['./tracking-documento.component.css']
})
export class TrackingDocumentoComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private documentoService: DocumentoService
  ) { }

  documento: Documento;
  settings = Object.assign({}, AppSettings.tableSettings);
  dataSeguimientosDocumento: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    this.settings.columns = {
      estado: {
        title: 'Estado'
      },
      observacion: {
        title: 'Observacion'
      },
      fecha: {
        title: 'Fecha'
      }
    };
    this.cargarSeguimientosDocumento();
  }



  cargarSeguimientosDocumento(){
    this.dataSeguimientosDocumento.reset();
    let dataSeguimientosDocumento = [];
    this.documento.seguimientosDocumento.sort((a,b) => a.id - b.id).forEach(
      segumientoDocumento => {
        dataSeguimientosDocumento.push({
          estado: segumientoDocumento.estadoDocumento.nombre,
          observacion: segumientoDocumento.observacion,
          fecha: segumientoDocumento.fecha
        });
      }
    )
    this.dataSeguimientosDocumento.load(dataSeguimientosDocumento);
  }




  ngOnDestroy() {

  }


}
