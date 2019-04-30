import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { DiaLaborable } from 'src/model/dialaborable.model';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DiaLaborableService } from 'src/app/shared/dialaborable.service';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { FeriadoService } from 'src/app/shared/feriado.service';
import { Feriado } from 'src/model/feriado.model';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';
import { Ambito } from 'src/model/ambito.model';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { ModificarAmbitoComponent } from './modificar-ambito/modificar-ambito.component';
import { AgregarFeriadoComponent } from './agregar-feriado/agregar-feriado.component';

@Component({
  selector: 'app-dias-laborables',
  templateUrl: './dias-laborables.component.html',
  styleUrls: ['./dias-laborables.component.css']
})
export class DiaLaborableComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private feriadoService: FeriadoService,
    private ambitoService: AmbitoService
  ) { }

  dataAmbitos: LocalDataSource = new LocalDataSource();
  dataFeriados: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  feriado: Feriado;
  feriados: Feriado[] = [];
  ambito: Ambito;
  ambitos: Ambito[] = [];

  // diaslaborablesSubscription: Subscription;
  dialaborableForm: FormGroup;

  ngOnInit() {
    this.generarTablaAmbitos();
    this.listarAmbitos();
    this.generarTablaFeriado();
    this.listarFeriados();
  }

  generarTablaAmbitos() {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Ámbito'
      },
      dias: {
        title: 'Días laborables'
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
              id: ambito ? ambito.id : 'no tiene',
              nombre: ambito ? ambito.nombre : 'no tiene',
              dias: ambito.diasHora.map(dialaborable => dialaborable.dia.nombre).join(", ")
            })
          }
        )
        this.dataAmbitos.load(dataAmbitos);
      }
    )
  }

  generarTablaFeriado() {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      fecha: {
        title: 'Fecha'
      },
      periodo: {
        title: 'Periodo'
      },
      ambito: {
        title: 'Ámbito'
      },
      buttonEliminar: {
        title: 'Eliminar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.eliminarFeriado(row);
          });
        }
      }
    }
  }

  listarFeriados() {
    this.dataFeriados.reset();
    this.feriadoService.listarFeriadosAll().subscribe(
      feriados => {
        this.feriados = feriados;
        let dataFeriados = [];
        feriados.forEach(
          feriado => {
            dataFeriados.push({
              id: feriado.id,
              nombre: feriado.nombre,
              fecha: feriado.fecha,
              periodo: feriado.periodo,
              ambito: feriado.ambito
            })
          }
        )
        this.dataFeriados.load(dataFeriados);
      }
    )
  }

  modificarAmbito(row) {
    this.ambito = this.ambitos.find(ambito => ambito.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarAmbitoComponent, {
      initialState: {
        id: this.ambito.id,
        feriado: this.ambito,
        titulo: 'Modificar horario de atención'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.modificarEvent.subscribe(() =>
      this.listarAmbitos()
    )
  }

  onAgregar() {
    this.agregarFeriado();
  }

  agregarFeriado() {
    let bsModalRef: BsModalRef = this.modalService.show(AgregarFeriadoComponent, {
      initialState: {
        titulo: 'Agregar proveedor'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.feriadoCreadoEvent.subscribe(() =>
      this.listarFeriados()
    )
  }



  eliminarFeriado(row) {
    this.feriado = this.feriados.find(feriado => feriado.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        id: this.feriado.id,
        feriado: this.feriado,
        titulo: 'Eliminar Feriado'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.confirmarEvent.subscribe(() =>
      this.listarFeriados()
    )
  }




}
