import { GuiaService } from './../../shared/guia.service';
import { Guia } from './../../../model/guia.model';
import { ProveedorService } from './../../shared/proveedor.service';
import { TipoServicioService } from './../../shared/tiposervicio.service';
import { TipoSeguridadService } from './../../shared/tiposeguridad.service';
import { PlazoDistribucionService } from './../../shared/plazodistribucion.service';
import { Subscription } from 'rxjs';
import { Proveedor } from './../../../model/proveedor.model';
import { TipoSeguridad } from './../../../model/tiposeguridad.model';
import { PlazoDistribucion } from './../../../model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TipoServicio } from '../../../model/tiposervicio.model';
import { NotifierService } from '../../../../node_modules/angular-notifier';

@Component({
  selector: 'app-crear-guia-modal',
  templateUrl: './crear-guia-modal.component.html',
  styleUrls: ['./crear-guia-modal.component.css']
})

export class CrearGuiaModalComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private plazoDistribucionService: PlazoDistribucionService,
    private tipoSeguridadService: TipoSeguridadService,
    private tipoServicioService: TipoServicioService,
    private proveedorService: ProveedorService,
    private guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  guiaForm: FormGroup;

  @Output() guiaCreadaEvent = new EventEmitter<Guia>();

  plazosDistribucion: PlazoDistribucion[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  proveedores: Proveedor[];

  tiposServicioSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  plazosDistribucionSubscription: Subscription;
  proveedoresSubscription: Subscription;
  crearGuiaSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.guiaForm = new FormGroup({
      'plazoDistribucion': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'proveedor': new FormControl(null, Validators.required),
      'numeroGuia': new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
  }

  cargarDatosVista() {
    this.tiposServicioSubscription = this.tipoServicioService.tiposServicioChanged.subscribe(
      tiposServicio => {
        this.tiposServicio = tiposServicio;
      }
    );
    this.tiposSeguridadSubscription = this.tipoSeguridadService.tiposSeguridadChanged.subscribe(
      tiposSeguridad => {
        this.tiposSeguridad = tiposSeguridad;
      }
    );
    this.plazosDistribucionSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
      plazosDistribucion => {
        this.plazosDistribucion = plazosDistribucion;
      }
    );

    this.proveedoresSubscription = this.proveedorService.proveedoresChanged.subscribe(
      proveedores => {
        this.proveedores = proveedores;
      }
    );
  }

  onSubmit(guia) {
    this.crearGuiaSubscription = this.guiaService.registrarGuia(guia).subscribe(
      guia => {
        this.notifier.notify('success', 'Se ha registrado la guía correctamente');
        this.bsModalRef.hide();
        this.guiaCreadaEvent.emit(guia);
      },
      error => {
        this.notifier.notify('error', error.error.mensaje);
      }
    )
  }



  ngOnDestroy() {
    this.tiposServicioSubscription.unsubscribe();
    this.tiposSeguridadSubscription.unsubscribe();
    this.plazosDistribucionSubscription.unsubscribe();
    this.proveedoresSubscription.unsubscribe();
  }

}
