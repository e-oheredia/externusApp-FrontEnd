import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AppSettings } from 'src/app/shared/app.settings';
import { Ambito } from 'src/model/ambito.model';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ButtonViewComponent } from 'src/app/table-management/button-view/button-view.component';
import { AgregarAmbitoComponent } from './agregar-ambito/agregar-ambito.component';
import { ModificarAmbitoComponent } from './modificar-ambito/modificar-ambito.component';
import { AdjuntarUbigeoComponent } from './adjuntar-ubigeo/adjuntar-ubigeo.component';
import { AmbitoDistrito } from '../../../model/ambitodistrito';
import { WriteExcelService } from '../../shared/write-excel.service';
import { DistritoService } from 'src/app/shared/distrito.service';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';
import { Distrito } from 'src/model/distrito.model';

@Component({
  selector: 'app-ambito',
  templateUrl: './ambito.component.html',
  styleUrls: ['./ambito.component.css']
})
export class AmbitoComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    public ambitoService: AmbitoService,
    private utilsService: UtilsService,
    private distritoService: DistritoService,
    private notifierService: NotifierService
  ) { }

  @Output() confirmarEvent = new EventEmitter<File>();

  dataAmbitos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  ambito: Ambito;
  ambitos: Ambito[] = [];
  procesarForm: FormGroup;
  ambitosSubscription: Subscription;
  ambitoForm: FormGroup;
  ambitodistrito: AmbitoDistrito[] = [];
  excelFile: File;
  distritosconAmbitos: Distrito[] = [];

  ngOnInit() {
    this.generarColumnas();
    this.listarAmbitos();
    this.settings.hideSubHeader = false;
    this.procesarForm = new FormGroup({
      'excel': new FormControl(null, Validators.required)
    })
  }

  generarColumnas() {
    this.settings.columns = {
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

  exportar() {
    this.ambitoService.listarAmbitoDistritos().subscribe(
      ambitodistrito => {
        this.ambitodistrito = ambitodistrito;
        this.ambitoService.exportarAmbitoDistrito(ambitodistrito)
      }
    )
  }

  onChangeExcelFile(file: File) {
    if (file == null) {
      this.excelFile = null;
      return null;
    } else {
      this.excelFile = file;
      this.importarExcel(this.excelFile);
    }
  }

  importarExcel(file: File) {
    this.ambitoService.validarDistritosAmbitos(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.distritosconAmbitos = data;
        return;
      }
      this.notifierService.notify('error', data.mensaje);
    })
  }


  onSubmit(procesarForm: FormGroup) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        titulo: "Adjuntar ubigeos con ámbitos",
        mensaje: "¿Desea actualizar los distritos con los nuevos ámbitos?"
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      this.registrarDistritosConAmbitos();
    })
  }

  registrarDistritosConAmbitos() {
    this.ambitoService.subirDistritosconAmbitos(this.distritosconAmbitos).subscribe(
      respuesta => {
        this.notifierService.notify('success', respuesta.mensaje);
        this.procesarForm.reset();
        this.listarAmbitos();
      },
      error => {
        this.notifierService.notify('error', error.error.mensaje);
      }
    )
  }



}
