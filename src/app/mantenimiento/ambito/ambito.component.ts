import { Component, OnInit } from '@angular/core';
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
import { InconsistenciaResultado } from '../../../model/inconsistenciaresultado.model';
import { EstadoDocumentoEnum } from '../../enum/estadodocumento.enum';
import { UtilsService } from '../../shared/utils.service';
import { NotifierService } from '../../../../node_modules/angular-notifier';
import { ReadExcelService } from '../../shared/read-excel.service';

@Component({
  selector: 'app-ambito',
  templateUrl: './ambito.component.html',
  styleUrls: ['./ambito.component.css']
})
export class AmbitoComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private readExcelService: ReadExcelService,
    public ambitoService: AmbitoService,
    private writeExcelService: WriteExcelService,
    private utilsService: UtilsService,
    private notifier: NotifierService
  ) { }

  dataAmbitos: LocalDataSource = new LocalDataSource();
  settings = AppSettings.tableSettings;
  ambito: Ambito;
  ambitos: Ambito[] = [];
  procesarForm: FormGroup;
  ambitosSubscription: Subscription;
  ambitoForm: FormGroup;
  ambitodistrito: AmbitoDistrito[] = [];
  dataGuiasPorProcesar: LocalDataSource = new LocalDataSource();
  rutaPlantillaResultados: string = AppSettings.PLANTILLA_RESULTADOS;

  excelFile: File;
  resultadosCorrectos: AmbitoDistrito[] = [];
  resultadosIncorrectos: InconsistenciaResultado[] = [];

  guiasSubscription: Subscription;
  estadoDocumentoForm = EstadoDocumentoEnum;

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
      plazo: {
        title: 'Plazos'
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
              plazo: ambito.plazos ? ambito.plazos.map(plazo => plazo.nombre).join(", ") : "-",
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
      this.resultadosCorrectos = [];
      this.resultadosIncorrectos = [];
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }

  importarExcel() {
    if (this.excelFile == null) {
      return null;
    }
    if (this.resultadosIncorrectos.length > 0) {
      this.mostrarResultadosCargados2(this.excelFile);
      return;
    }
    this.mostrarResultadosCargados(this.excelFile);
  }

  mostrarResultadosCargados(file: File) {
    this.ambitoService.validarResultadosDelProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.resultadosCorrectos = data.documentos;
        this.resultadosIncorrectos = data.inconsistenciasResultado;
        // if(this.utilsService.isUndefinedOrNullOrEmpty(this.resultadosIncorrectos)){
        //   this.resultadosIncorrectos = [];
        // }
        // descargar inconsistencias
        if (this.resultadosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.resultadosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  mostrarResultadosCargados2(file: File) {
    this.ambitoService.validarResultadosDelProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        console.log("primeros correctos: " + this.resultadosCorrectos.length)
        console.log("nuevos correctos: " + data.documentos.length)
        this.resultadosCorrectos = this.resultadosCorrectos.concat(data.documentos);
        this.resultadosIncorrectos = data.inconsistenciasResultado;
        // descargar inconsistencias
        if (this.resultadosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.resultadosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  descargarInconsistencias(inconsistencias: InconsistenciaResultado[]) {
    this.ambitoService.exportarInconsistenciasResultadosProveedor(inconsistencias);
  }





  onSubmit(){
    let bsModalRef: BsModalRef = this.modalService.show(AdjuntarUbigeoComponent, {
      initialState: {
        titulo: "Adjuntar ubigeos con ámbitos",
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    this.modalService.onHide.subscribe(
      () => {
        this.procesarForm.reset();
        // this.buzonService.listarBuzonesAll().subscribe(buzones => {
        //   this.buzones = buzones
        // })
      }
    )
  }



}
