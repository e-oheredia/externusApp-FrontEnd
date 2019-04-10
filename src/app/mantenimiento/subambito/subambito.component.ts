import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { SubAmbitoService } from 'src/app/shared/subambito.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { SubAmbito } from 'src/model/subambito.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { AgregarSubambitoComponent } from './agregar-subambito/agregar-subambito.component';
import { ModificarSubambitoComponent } from './modificar-subambito/modificar-subambito.component';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';

@Component({
  selector: 'app-subambito',
  templateUrl: './subambito.component.html',
  styleUrls: ['./subambito.component.css']
})
export class SubambitoComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private tituloService: TituloService,
    public subambitoService: SubAmbitoService
  ) { }

  dataSubAmbitos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  subambito: SubAmbito;
  subambitos: SubAmbito[] = [];

  subambitosSubscription: Subscription;
  subambitoForm: FormGroup;

  ngOnInit() {
    this.generarColumnas();
    this.listarSubAmbitos();
  }

  generarColumnas() {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      ambito: {
        title: 'Ambito'
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
            this.modificarAmbito(row);
          });
        }
      }
    }
  }

  listarSubAmbitos() {
    this.dataSubAmbitos.reset();
    this.subambitoService.listarSubAmbitosAll().subscribe(
      subambitos => {
        this.subambitos = subambitos;
        let dataSubAmbitos = [];
        subambitos.forEach(
          subambito => {
            dataSubAmbitos.push({
              id: subambito.id,
              nombre: subambito.nombre,
              ambito: subambito.ambito.nombre,
              estado: subambito.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataSubAmbitos.load(dataSubAmbitos);
      }
    )
    console.log(this.subambitos)
  }

  onAgregar() {
    this.agregarSubAmbito();
  }

  agregarSubAmbito() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarSubambitoComponent, {
      initialState: {
        titulo: 'Agregar subambito',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.subambitoCreadoEvent.subscribe(() =>
      this.listarSubAmbitos()
    )
  }

  modificarAmbito(row) {
    this.subambito = this.subambitos.find(subambito => subambito.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarSubambitoComponent, {
      initialState: {
        id: this.subambito.id,
        subambito: this.subambito,
        titulo: 'Modificar el subambito'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.subambitoModificadoEvent.subscribe(() =>
      this.listarSubAmbitos()
    )
  }


}
