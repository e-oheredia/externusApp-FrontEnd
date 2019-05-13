import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from '../shared/app.settings';
import { Guia } from 'src/model/guia.model';
import { GuiaService } from '../shared/guia.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';
import { ModificarGuiabloqueComponent } from './modificar-guiabloque/modificar-guiabloque.component';
import { EliminarGuiabloqueComponent } from './eliminar-guiabloque/eliminar-guiabloque.component';
import { EnviarGuiabloqueComponent } from './enviar-guiabloque/enviar-guiabloque.component';

@Component({
  selector: 'app-listar-guiasbloque-creadas',
  templateUrl: './listar-guiasbloque-creadas.component.html',
  styleUrls: ['./listar-guiasbloque-creadas.component.css']
})
export class ListarGuiasbloqueCreadasComponent implements OnInit {

  constructor(
    private guiaService: GuiaService,
    private modalService: BsModalService,
  ) { }

  dataGuiasBloque: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  guias: Guia[] = [];
  guia: Guia;

  guiaSubscription: Subscription;
  guiaForm: FormGroup;

  ngOnInit() {
    this.generarColumnas();
    this.listarGuiasBloque();
    console.log(this.guia)
  }

  generarColumnas() {
    this.settings.columns = {
      numeroGuia: {
        title: 'Número de Guía'
      },
      producto: {
        title: 'Producto'
      },
      tipoServicio: {
        title: 'Tipo de servicio'
      },
      clasificacion: {
        title: 'Clasificación'
      },
      proveedor: {
        title: 'Proveedor'
      },
      plazoDistribucion: {
        title: 'Plazo de distribución'
      },
      totalDocumentos: {
        title: 'Total de documentos'
      },
      tipoSeguridad: {
        title: 'Tipo de seguridad'
      },
      fechaCreacion: {
        title: 'Fecha de creación'
      },
      buttonEliminar: {
        title: 'Eliminar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-times";
          instance.pressed.subscribe(row => {
            this.eliminarGuiaBloque(row);
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
            this.modificarGuiaBloque(row);
          });
        }
      },
      buttonEnviar: {
        title: 'Enviar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-share";
          instance.pressed.subscribe(row => {
            this.enviarGuiaBloque(row);
          });
        }
      }
    }
  }

  listarGuiasBloque() {
    this.dataGuiasBloque.reset();
    this.guiaService.listarGuiasBloqueCreadas().subscribe(
      guias => {
        this.guias = guias;
        let dataGuiasBloque = [];
        guias.forEach(
          guia => {
            dataGuiasBloque.push({
              numeroGuia: guia.numeroGuia,
              producto: guia.producto.nombre,
              tipoServicio: guia.tipoServicio.nombre,
              clasificacion: guia.clasificacion.nombre,
              proveedor: guia.proveedor.nombre,
              plazoDistribucion: guia.plazoDistribucion.nombre,
              totalDocumentos: guia.cantidadDocumentos,
              tipoSeguridad: guia.tipoSeguridad.nombre,
              fechaCreacion: this.guiaService.getFechaCreacion(guia)
            })
          })
        this.dataGuiasBloque.load(dataGuiasBloque);
      }
    )
  }

  eliminarGuiaBloque(row) {
    this.guia = this.guias.find(guia => guia.numeroGuia == row.numeroGuia)
    let bsModalRef: BsModalRef = this.modalService.show(EliminarGuiabloqueComponent, {
      initialState: {
        id: this.guia.id,
        guia: this.guia,
        titulo: 'Eliminar guía bloque'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.eliminarGuiaBloqueEvent.subscribe(() =>
    this.listarGuiasBloque()
    )
  }


  modificarGuiaBloque(row) {
    this.guia = this.guias.find(guia => guia.numeroGuia == row.numeroGuia)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarGuiabloqueComponent, {
      initialState: {
        id: this.guia.id,
        guia: this.guia,
        titulo: 'Modificar guía bloque'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.modificarGuiaBloqueEvent.subscribe(() =>
    this.listarGuiasBloque()
    )
  }


  enviarGuiaBloque(row) {
    this.guia = this.guias.find(guia => guia.numeroGuia == row.numeroGuia)
    console.log(this.guia)
    let bsModalRef: BsModalRef = this.modalService.show(EnviarGuiabloqueComponent, {
      initialState: {
        id: this.guia.id,
        guia: this.guia,
        titulo: 'Enviar guía bloque'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.enviarGuiaBloqueEvent.subscribe(() =>
    this.listarGuiasBloque()
    )
  }


}