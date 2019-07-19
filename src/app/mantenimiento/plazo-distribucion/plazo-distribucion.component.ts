import { Component, OnInit } from '@angular/core';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModificarPlazoComponent } from './modificar-plazo/modificar-plazo.component';
import { AgregarPlazoComponent } from './agregar-plazo/agregar-plazo.component';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { Ambito } from 'src/model/ambito.model';
import { Region } from 'src/model/region.model';

@Component({
  selector: 'app-plazo-distribucion',
  templateUrl: './plazo-distribucion.component.html',
  styleUrls: ['./plazo-distribucion.component.css']
})
export class PlazoDistribucionComponent implements OnInit {

  constructor(
    public plazoDistribucionService: PlazoDistribucionService,
    private modalService: BsModalService,
    private tituloService: TituloService
  ) { }

  dataPlazosDistribucion: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  plazos: PlazoDistribucion[] = [];
  plazo: PlazoDistribucion;
  region: Region;
  ambito: Ambito;
  plazosSubscription: Subscription;
  plazoForm: FormGroup;

  ngOnInit() {
    this.tituloService.setTitulo("Mantenimiento de plazos de distribución");
    this.generarColumnas();
    this.listarPlazosDistribucion();
    this.settings.hideSubHeader = false;

  }

  generarColumnas() {
    this.settings.columns = {
      nombre: {
        title: 'Nombre'
      },
      plazos: {
        title: 'Plazo de distribución (hrs)'
      },
      tipoPlazo: {
        title: 'Tipo de plazo'
      },
      region: {
        title: 'Region'
      },
      estado: {
        title: 'Estado'
      },
      buttonModificar: {
        title: 'Modificar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.modificarPlazo(row);
          });
        }
      }
    }
  }


  listarPlazosDistribucion() {
    this.dataPlazosDistribucion.reset();
    this.plazoDistribucionService.listarPlazosDistribucionAll().subscribe(
      plazos => {
        this.plazos = plazos;
        let dataPlazosDistribucion = [];
        plazos.forEach(
          plazo => {
            dataPlazosDistribucion.push({
              id: plazo.id,
              nombre: plazo.nombre,
              plazos: plazo.tiempoEnvio,
              tipoPlazo: plazo.tipoPlazoDistribucion.nombre,
              region: plazo.regiones[0] ? plazo.regiones.map(regiones => regiones.nombre).join(", ") : "-",
              estado: plazo.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataPlazosDistribucion.load(dataPlazosDistribucion);
      }
    )
  }

  onAgregar() {
    this.agregarPlazo();
  }

  agregarPlazo() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarPlazoComponent, {
      initialState: {
        titulo: 'Agregar plazo de distribución',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.plazoCreadoEvent.subscribe(() =>
      this.listarPlazosDistribucion()
    )
  }


  modificarPlazo(row) {
    this.plazo = this.plazos.find(plazo => plazo.id == row.id)

    let bsModalRef: BsModalRef = this.modalService.show(ModificarPlazoComponent, {
      initialState: {
        id: this.plazo.id,
        plazo: this.plazo,
        titulo: 'Modificar el plazo de la distribución'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.confirmarEvent.subscribe(() =>
      this.listarPlazosDistribucion()
    )
  }



}
