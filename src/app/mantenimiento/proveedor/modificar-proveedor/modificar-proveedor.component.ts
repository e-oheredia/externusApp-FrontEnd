import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { Subscription } from 'rxjs';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { NotifierService } from 'angular-notifier';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';
import { Region } from 'src/model/region.model';
import { Ambito } from 'src/model/ambito.model';
import { RegionService } from 'src/app/shared/region.service';
import { AmbitoService } from 'src/app/shared/ambito.service';


@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.css']
})
export class ModificarProveedorComponent implements OnInit {

  constructor(
    private utilsService: UtilsService,
    private bsModalRef: BsModalRef,
    private plazoDistribucionService: PlazoDistribucionService,
    private regionService: RegionService,
    private ambitoService: AmbitoService,
    private proveedorService: ProveedorService,
    private notifier: NotifierService,
    private modalService: BsModalService

  ) { }

  @Output() confirmarEvent = new EventEmitter();

  proveedor: Proveedor;
  modificarForm: FormGroup;
  plazosDistribucion:  PlazoDistribucion[];
  plazosDistribucionElegidos: PlazoDistribucion[];
  regiones: Region[];
  regionesElegidas: Region[];
  ambitos: Ambito[];
  ambitosElegidos: Ambito[];

  modificarProveedorSubscription: Subscription;

  
 ngOnInit() {
    this.modificarForm = new FormGroup({
      'nombreProveedor' : new FormControl(this.proveedor.nombre, Validators.required),
      'activo' : new FormControl(this.proveedor.activo, Validators.required),
      // 'plazos': new FormArray([]),
      'regiones': new FormArray([]),
      'ambitos': new FormArray([])
    });
    // this.listarPlazosDistribucion();
    // this.plazosDistribucionElegidos = this.proveedor.plazosDistribucion;

    this.listarRegiones();

    this.listarAmbitos();
    this.ambitosElegidos = this.proveedor.ambitos;
  }

  // listarPlazosDistribucion() {
  //   this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();

  //   if (this.plazosDistribucion) {
  //     this.plazosDistribucion.forEach(plazo => {
  //       const control = new FormControl(this.proveedor.plazosDistribucion.findIndex(plazoProveedor => plazoProveedor.id === plazo.id) > -1);
  //       (<FormArray>this.modificarForm.get('plazos')).push(control);
  //     });
  //   }

  //   this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
  //     plazosDistribucion => {
  //       this.plazosDistribucion = plazosDistribucion;
  //       plazosDistribucion.forEach(plazo => {
  //         const control = new FormControl(this.proveedor.plazosDistribucion.findIndex(plazoProveedor => plazoProveedor.id === plazo.id) > -1);
  //         (<FormArray>this.modificarForm.get('plazos')).push(control);
  //       });
  //     }
  //   )
  // }



  listarRegiones(){
    this.regiones = this.regionService.getRegiones();

    if(this.regiones){
      this.regiones.forEach(region => {
        const control = new FormControl(this.proveedor.ambitos.findIndex(ambito => ambito.region.id === region.id) > -1);
        (<FormArray>this.modificarForm.get('regiones')).push(control);
      })
      this.regionesElegidas = this.regiones.filter(region => this.proveedor.ambitos.findIndex(ambito => ambito.region.id === region.id) > -1)
    } else {
      this.regionService.regionesChanged.subscribe(
        regiones => {
          this.regiones = regiones;
          regiones.forEach(region => {
            const control = new FormControl(this.proveedor.ambitos.findIndex(ambito => ambito.region.id === region.id) > -1);
            (<FormArray>this.modificarForm.get('regiones')).push(control);
          })
          this.regionesElegidas = this.regiones.filter(region => this.proveedor.ambitos.findIndex(ambito => ambito.region.id === region.id) > -1)
        }
      )
    }

  }



  listarAmbitos(){
    this.ambitos = this.ambitoService.getAmbitos();

    if(this.ambitos){
      this.ambitos.forEach(ambito => {
        const control = new FormControl(this.proveedor.ambitos.findIndex(ambitoProveedor => ambitoProveedor.id === ambito.id) > -1);
        (<FormArray>this.modificarForm.get('ambitos')).push(control);
      });
    }
    this.ambitoService.ambitosChanged.subscribe(
      ambitos => {
        this.ambitos = ambitos;
        ambitos.forEach(ambito => {
          const control = new FormControl(this.proveedor.ambitos.findIndex(ambitoProveedor => ambitoProveedor.id === ambito.id) > -1);
          (<FormArray>this.modificarForm.get('ambitos')).push(control);
        })
      }
    )
  }


  onSubmit(form: any){
    if(!this.utilsService.isUndefinedOrNullOrEmpty(this.modificarForm.controls['nombreProveedor'].value) && this.ambitosElegidos.length !==0){
      let proveedor = Object.assign({}, this.proveedor)
      let nombreSinEspacios = this.modificarForm.controls['nombreProveedor'].value.trim();
      proveedor.nombre = nombreSinEspacios;
      proveedor.activo = this.modificarForm.get('activo').value;
      //proveedor.plazosDistribucion=[];
      //proveedor.ambitos=this.modificarForm.get('ambitosProveedor').value;

      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en los proveedores actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
      this.modificarProveedorSubscription = this.proveedorService.modificarProveedor(proveedor.id, proveedor).subscribe(
        proveedor => {
          this.notifier.notify('success', 'Se ha modificado el proveedor correctamente');
          this.bsModalRef.hide();
          this.confirmarEvent.emit(proveedor);
        },
        error => {
          this.notifier.notify('error', 'El nombre modificado ya existe');
        }
        );
      })
    }
  }

  // onChangePlazoDistribucionElegido(event: any, plazoDistribucion: PlazoDistribucion) {
  //   event.srcElement.checked ? this.plazosDistribucionElegidos.push(plazoDistribucion) : this.plazosDistribucionElegidos.splice(this.plazosDistribucionElegidos.indexOf(this.plazosDistribucionElegidos.find(plazo => plazo.id === plazoDistribucion.id)), 1);
  // }
 
  onChangeRegionElegida(event: any, region: Region) {
    event.srcElement.checked ? this.regionesElegidas.push(region) : this.regionesElegidas.splice(this.regionesElegidas.indexOf(this.regionesElegidas.find(regionProveedor => regionProveedor.id === region.id)), 1);
  }

  onChangeAmbitoElegido(event: any, ambito: Ambito) {
    event.srcElement.checked ? this.ambitosElegidos.push(ambito) : this.ambitosElegidos.splice(this.ambitosElegidos.indexOf(this.ambitosElegidos.find(ambitoProveedor => ambitoProveedor.id === ambito.id)), 1);
  }
 

}
