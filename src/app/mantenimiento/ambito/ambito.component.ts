import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TituloService } from 'src/app/shared/titulo.service';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { Ambito } from 'src/model/ambito.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { AgregarAmbitoComponent } from './agregar-ambito/agregar-ambito.component';
import { ModificarAmbitoComponent } from './modificar-ambito/modificar-ambito.component';
import { MensajeExitoComponent } from 'src/app/modals/mensaje-exito/mensaje-exito.component';

@Component({
  selector: 'app-ambito',
  templateUrl: './ambito.component.html',
  styleUrls: ['./ambito.component.css']
})
export class AmbitoComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    public ambitoService: AmbitoService
  ) { }

  dataAmbitos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  ambito: Ambito;
  ambitos: Ambito[] = [];

  ambitosSubscription: Subscription;
  ambitoForm: FormGroup;

  ngOnInit() {
    this.generarColumnas();
    this.listarAmbitos();
  }

  generarColumnas() {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      region: {
        title: 'Región'
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

  listarAmbitos() {
    this.dataAmbitos.reset();
    this.ambitoService.listarAmbitosAll().subscribe(
      ambitos => {
        this.ambitos = ambitos;
        let dataAmbitos = [];
        ambitos.forEach(
          ambito => {
            dataAmbitos.push({
              id: ambito.id,
              nombre: ambito.nombre,
              region: ambito.region.nombre,
              estado: ambito.activo ? 'ACTIVADO' : 'DESACTIVADO'
            })
          }
        )
        this.dataAmbitos.load(dataAmbitos);
      }
    )
  }

  onAgregar() {
    this.agregarAmbito();
  }

  agregarAmbito() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarAmbitoComponent, {
      initialState: {
        titulo: 'Agregar ámbito',
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.ambitoCreadoEvent.subscribe(() =>
      this.listarAmbitos()
    )
  }

  modificarAmbito(row) {
    this.ambito = this.ambitos.find(ambito => ambito.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarAmbitoComponent, {
      initialState: {
        id: this.ambito.id,
        ambito: this.ambito,
        titulo: 'Modificar el ámbito'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.ambitoModificadoEvent.subscribe(() =>
      this.listarAmbitos()
    )
  }


}
