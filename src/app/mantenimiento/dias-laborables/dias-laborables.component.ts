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
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-dias-laborables',
  templateUrl: './dias-laborables.component.html',
  styleUrls: ['./dias-laborables.component.css']
})
export class DiaLaborableComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private feriadoService: FeriadoService,
    private ambitoService: AmbitoService,
    private notifier: NotifierService,
  ) { }

  dataAmbitos: LocalDataSource = new LocalDataSource();
  dataFeriados: LocalDataSource = new LocalDataSource();
  settings = Object.assign({},AppSettings.tableSettings);
  settings2 = Object.assign({},AppSettings.tableSettings);
  feriado: Feriado;
  feriados: Feriado[] = [];
  ambito: Ambito;
  ambitos: Ambito[] = [];

  dialaborableForm: FormGroup;

  ngOnInit() {
    this.generarTablaAmbitos();
    this.listarAmbitos();
    this.generarTablaFeriado();
    this.listarFeriados();
    this.settings2.hideSubHeader = false;
  }

  generarTablaAmbitos() {
    this.settings.columns = {
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
              id: ambito.id,
              nombre: ambito ? ambito.nombre : 'no tiene',
              dias: ambito.diasLaborables.filter(dia => dia.activo==1).sort((a,b) => a.id - b.id).map(diaLaborable => diaLaborable.dia.nombre).join(", ")
            })
          }
        )
        this.dataAmbitos.load(dataAmbitos);
      }
    )
  }

  generarTablaFeriado() {
    this.settings2.columns = {
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
          instance.claseIcono = "fas fa-times";
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
              periodo: feriado.modeltipo.nombre,
              ambito: feriado.ambitos.map(ambito => ambito.nombre).join(", ")
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
        ambito: this.ambito,
        titulo: 'Modificar horario de atención'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.ambitoModificadoEvent.subscribe(() =>
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
        titulo: 'Eliminar Feriado',
        mensaje: "¿Está seguro que desea eliminar el feriado?"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.feriadoService.eliminarFeriado(this.feriado.id).subscribe(
        respuesta => {
          this.notifier.notify('success', 'Se ha eliminado el feriado con éxito');
          this.listarFeriados();
        },
        error => {
          this.notifier.notify('error', error.message);
        }
        
      )
    })
  }


}
