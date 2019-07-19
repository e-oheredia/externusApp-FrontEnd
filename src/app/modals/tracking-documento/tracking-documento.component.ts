import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/shared/app.settings';
import { LocalDataSource } from 'ng2-smart-table';
import { Documento } from 'src/model/documento.model';
import { DocumentoService } from 'src/app/shared/documento.service';
import { SeguimientoDocumento } from 'src/model/seguimientodocumento.model';
import { Router } from '@angular/router';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';


@Component({
  selector: 'app-tracking-documento',
  templateUrl: './tracking-documento.component.html',
  styleUrls: ['./tracking-documento.component.css']
})
export class TrackingDocumentoComponent implements OnInit, OnDestroy {



  constructor(
    public bsModalRef: BsModalRef,
    private documentoService: DocumentoService,
    private router: Router
  ) { }

  documento: Documento;
  settings = Object.assign({}, AppSettings.tableSettings);
  dataSeguimientosDocumento: LocalDataSource = new LocalDataSource();

  ngOnInit() {

    this.settings.columns = {
      estado: {
        title: 'Estado'
      },
      motivo: {
        title: 'Motivo'
      },
      observacion: {
        title: 'Observacion'
      },
      fecha: {
        title: 'Fecha'
      },
      link: {
        title: 'Imagen',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.mostrarData.subscribe(row => {
            instance.claseIcono = "fa fa-eye";
            let seguimientodocumento = this.documento.seguimientosDocumento.find(x => x.id === row.id);
            let ruta_imagen: any;
            if (seguimientodocumento.linkImagen === null) {
              ruta_imagen = " ";
              instance.claseIcono = " "
            } else {
              ruta_imagen = seguimientodocumento.linkImagen;
            }
            instance.ruta = ruta_imagen;
          })
        }
      },
    };
    this.cargarSeguimientosDocumento();
    this.settings.hideSubHeader = true;
  }



  cargarSeguimientosDocumento() {
    this.dataSeguimientosDocumento.reset();
    let dataSeguimientosDocumento = [];
    this.documento.seguimientosDocumento.sort((a, b) => a.id - b.id).forEach(
      segumientoDocumento => {
        dataSeguimientosDocumento.push({
          id: segumientoDocumento.id,
          estado: segumientoDocumento.estadoDocumento.nombre,
          motivo: segumientoDocumento.motivoEstado ? segumientoDocumento.motivoEstado.nombre : ' ',
          observacion: segumientoDocumento.observacion,
          fecha: segumientoDocumento.fecha,
          link: segumientoDocumento.linkImagen,

        });
      }
    )
    this.dataSeguimientosDocumento.load(dataSeguimientosDocumento);
  }




  ngOnDestroy() {

  }


}
