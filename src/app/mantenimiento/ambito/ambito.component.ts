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
  procesarForm: FormGroup;
  ambitosSubscription: Subscription;
  ambitoForm: FormGroup;

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
