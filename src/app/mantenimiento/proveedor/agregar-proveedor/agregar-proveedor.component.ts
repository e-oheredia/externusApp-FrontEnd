import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { Proveedor } from 'src/model/proveedor.model';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { Region } from 'src/model/region.model';
import { RegionService } from 'src/app/shared/region.service';
import { AmbitoService } from 'src/app/shared/ambito.service';
import { Ambito } from 'src/model/ambito.model';

@Component({
  selector: 'app-agregar-proveedor',
  templateUrl: './agregar-proveedor.component.html',
  styleUrls: ['./agregar-proveedor.component.css']
})
export class AgregarProveedorComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private proveedorService: ProveedorService, 
    private plazoDistribucionService: PlazoDistribucionService,
    private regionService: RegionService,
    private ambitoService: AmbitoService
  ) { }

  @Output() proveedorCreadoEvent = new EventEmitter<Proveedor>();

  proveedor: Proveedor;
  proveedores: Proveedor[] = [];
  agregarForm: FormGroup;
  plazosDistribucion: PlazoDistribucion[];
  plazosDistribucionElegidos: PlazoDistribucion[] = [];
  regiones: Region[];
  regionesElegidas: Region[] = [];
  ambitos: Ambito[];
  ambitosElegidos: Ambito[] = [];

  crearProveedorSubscription: Subscription;

  ngOnInit() {
    this.agregarForm = new FormGroup({
      'nombreProveedor' : new FormControl('', Validators.required),
      // 'plazosProveedor' : new FormControl('', Validators.required),
      'regionesProveedor' : new FormControl('', Validators.required),
      'ambitosProveedor' : new FormControl('', Validators.required),
    });

    // this.listarPlazosDistribucion();
    this.listarRegiones();
    this.listarAmbitos();
  }

  onSubmit(proveedor){
    let nombreSinEspacios = this.agregarForm.controls['nombreProveedor'].value.trim();
    if (nombreSinEspacios.length !== 0 && this.regionesElegidas.length !==0 && this.ambitosElegidos.length !==0) {
    let proveedor: Proveedor = new Proveedor();
    proveedor.nombre = nombreSinEspacios;
    proveedor.ambitos = this.ambitosElegidos;
    this.crearProveedorSubscription = this.proveedorService.agregarProveedor(proveedor).subscribe(
      proveedor => {
        this.notifier.notify('success', 'Se ha agregado el proveedor correctamente');
        this.bsModalRef.hide();
        this.proveedorCreadoEvent.emit(proveedor);
      },
      error => {
        this.notifier.notify('error', 'No se puede agregar un nombre existente');
      }
    );
  }
  else {
    this.notifier.notify('error', 'Debe ingresar todos los datos');
  }
}



  // listarPlazosDistribucion() {
  //   this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
  //   this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
  //     plazosDistribucion => this.plazosDistribucion = plazosDistribucion
  //   )
  // }

  // onChangePlazoDistribucionElegido(event: any, plazoDistribucion: PlazoDistribucion) {    
  //   event.srcElement.checked ? this.plazosDistribucionElegidos.push(plazoDistribucion) : this.plazosDistribucionElegidos.splice(this.plazosDistribucionElegidos.indexOf(plazoDistribucion), 1);
  // }



  listarRegiones(){
    this.regiones = this.regionService.getRegiones();
    this.regionService.regionesChanged.subscribe(
      regiones => this.regiones = regiones
    )
  }

  onChangeRegionesElegidas(event: any, region: Region) {    
    event.srcElement.checked ? this.regionesElegidas.push(region) : this.regionesElegidas.splice(this.regionesElegidas.indexOf(region), 1);
  }
  


  listarAmbitos(){
    this.ambitos = this.ambitoService.getAmbitos();
    this.ambitoService.ambitosChanged.subscribe(
      ambitos => this.ambitos = ambitos
    )
  }

  onChangeAmbitosElegidos(event: any, ambito: Ambito) {    
    event.srcElement.checked ? this.ambitosElegidos.push(ambito) : this.ambitosElegidos.splice(this.ambitosElegidos.indexOf(ambito), 1);
  }

}
