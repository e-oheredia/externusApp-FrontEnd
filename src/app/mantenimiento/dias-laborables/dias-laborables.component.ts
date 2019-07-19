import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormGroup } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { FeriadoService } from 'src/app/shared/feriado.service';
import { Feriado } from 'src/model/feriado.model';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';
import { Region } from 'src/model/region.model';
import { RegionService } from 'src/app/shared/region.service';
import { AgregarFeriadoComponent } from './agregar-feriado/agregar-feriado.component';
import { NotifierService } from 'angular-notifier';
import { ModificarRegionComponent } from './modificar-region/modificar-region.component';

@Component({
  selector: 'app-dias-laborables',
  templateUrl: './dias-laborables.component.html',
  styleUrls: ['./dias-laborables.component.css']
})
export class DiaLaborableComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private feriadoService: FeriadoService,
    private regionService: RegionService,
    private notifier: NotifierService,
  ) { }

  dataRegiones: LocalDataSource = new LocalDataSource();
  dataFeriados: LocalDataSource = new LocalDataSource();
  settings = Object.assign({}, AppSettings.tableSettings);
  settings2 = Object.assign({}, AppSettings.tableSettings);
  feriado: Feriado;
  feriados: Feriado[] = [];
  region: Region;
  regiones: Region[] = [];

  dialaborableForm: FormGroup;

  ngOnInit() {
    this.generarTablaRegiones();
    this.listarRegiones();
    this.generarTablaFeriado();
    this.listarFeriados();
    this.settings2.hideSubHeader = false;
  }

  generarTablaRegiones() {
    this.settings.columns = {
      nombre: {
        title: 'Región'
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
            this.modificarRegion(row);
          });
        }
      }
    }
  }


  listarRegiones() {
    this.dataRegiones.reset();
    this.regionService.listarRegionesAll().subscribe(
      regiones => {
        this.regiones = regiones;
        let dataRegiones = [];
        regiones.forEach(
          region => {
            dataRegiones.push({
              id: region.id,
              nombre: region ? region.nombre : 'no tiene',
              dias: region.diasLaborables.filter(dia => dia.activo == 1).sort((a, b) => a.id - b.id).map(diaLaborable => diaLaborable.dia.nombre).join(", ")
            })
          }
        )
        this.dataRegiones.load(dataRegiones);
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
      region: {
        title: 'Región'
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
              periodo: feriado.tipoperiodo.nombre,
              region: feriado.regiones.map(region => region.nombre).join(", ")
            })
          }
        )
        this.dataFeriados.load(dataFeriados);
      }
    )
  }

  modificarRegion(row) {
    this.region = this.regiones.find(region => region.id == row.id)
    let bsModalRef: BsModalRef = this.modalService.show(ModificarRegionComponent, {
      initialState: {
        id: this.region.id,
        region: this.region,
        titulo: 'Modificar horario de atención'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.regionModificadaEvent.subscribe(() =>
      this.listarRegiones()
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
          this.notifier.notify('error', error.error.message);
        }
      )
    })
  }


}
