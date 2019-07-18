import { GuiaService } from '../../shared/guia.service';
import { Guia } from '../../../model/guia.model';
import { ProveedorService } from '../../shared/proveedor.service';
import { TipoServicioService } from '../../shared/tiposervicio.service';
import { TipoSeguridadService } from '../../shared/tiposeguridad.service';
import { PlazoDistribucionService } from '../../shared/plazodistribucion.service';
import { Subscription } from 'rxjs';
import { Proveedor } from '../../../model/proveedor.model';
import { TipoSeguridad } from '../../../model/tiposeguridad.model';
import { PlazoDistribucion } from '../../../model/plazodistribucion.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TipoServicio } from '../../../model/tiposervicio.model';
import { NotifierService } from 'angular-notifier';
import { Clasificacion } from 'src/model/clasificacion.model';
import { Producto } from 'src/model/producto.model';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';
import { ProductoService } from 'src/app/shared/producto.service';
import { RegionService } from 'src/app/shared/region.service';
import { Region } from 'src/model/region.model';

@Component({
  selector: 'app-crear-guia-modal',
  templateUrl: './crear-guia-modal.component.html',
  styleUrls: ['./crear-guia-modal.component.css']
})

export class CrearGuiaModalComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private regionService: RegionService,
    private plazoDistribucionService: PlazoDistribucionService,
    private tipoSeguridadService: TipoSeguridadService,
    private tipoServicioService: TipoServicioService,
    private clasificacionService: ClasificacionService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private guiaService: GuiaService,
    private notifier: NotifierService
  ) { }

  guiaForm: FormGroup;

  @Output() guiaCreadaEvent = new EventEmitter<Guia>();

  regiones: Region[];
  plazosDistribucion: PlazoDistribucion[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  proveedores: Proveedor[];
  clasificaciones: Clasificacion[];
  productos: Producto[];

  regionesSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  plazosDistribucionSubscription: Subscription;
  clasificacionesSubscription: Subscription;
  productosSubscription: Subscription;
  proveedoresSubscription: Subscription;
  crearGuiaSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.guiaForm = new FormGroup({
      'region': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'clasificacion': new FormControl(null, Validators.required),
      'producto': new FormControl(null, Validators.required),
      'proveedor': new FormControl(null, Validators.required),
      'numeroGuia': new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)])
    });
  }

  cargarDatosVista() {
    this.regiones = this.regionService.getRegiones();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.clasificaciones = this.clasificacionService.getClasificaciones();
    this.productos = this.productoService.getProductos();
    this.proveedores = this.proveedorService.getProveedores();

    this.regionesSubscription = this.regionService.regionesChanged.subscribe(
      regiones => {
        this.regiones = regiones;
      }
    );
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
    this.clasificacionesSubscription = this.clasificacionService.clasificacionesChanged.subscribe(
      clasificaciones => {
        this.clasificaciones = clasificaciones;
      }
    )
    this.productosSubscription = this.productoService.productosChanged.subscribe(
      productos => {
        this.productos = productos;
      }
    )
    this.proveedoresSubscription = this.proveedorService.proveedoresChanged.subscribe(
      proveedores => {
        this.proveedores = proveedores;
      }
    );
  }

  onRegionSelectedChanged(region){
    this.plazosDistribucionSubscription = this.plazoDistribucionService.listarPlazosDistribucionByRegionId(region.id).subscribe(
      plazos => {
        this.plazosDistribucion = plazos;
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
