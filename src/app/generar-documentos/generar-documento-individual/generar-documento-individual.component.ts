import { AutogeneradoCreadoModalComponent } from './../autogenerado-creado-modal/autogenerado-creado-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CargoPdfService } from './../../shared/cargo-pdf.service';
import { AppSettings } from '../../shared/app.settings';
import { EnvioService } from '../../shared/envio.service';
import { Envio } from '../../../model/envio.model';
import { PlazoDistribucion } from '../../../model/plazodistribucion.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlazoDistribucionService } from '../../shared/plazodistribucion.service';
import { TipoServicioService } from '../../shared/tiposervicio.service';
import { DepartamentoService } from '../../shared/departamento.service';
import { ProvinciaService } from '../../shared/provincia.service';
import { DistritoService } from '../../shared/distrito.service';
import { TipoSeguridadService } from '../../shared/tiposeguridad.service';
import { TipoSeguridad } from '../../../model/tiposeguridad.model';
import { TipoServicio } from '../../../model/tiposervicio.model';
import { Departamento } from '../../../model/departamento.model';
import { Provincia } from '../../../model/provincia.model';
import { Distrito } from '../../../model/distrito.model';
import { Subscription } from 'rxjs';
import { Buzon } from '../../../model/buzon.model';
import { BuzonService } from '../../shared/buzon.service';
import { Documento } from '../../../model/documento.model';
import { UtilsService } from '../../shared/utils.service';
import { Sede } from 'src/model/sede.model';
import { SedeDespachoService } from 'src/app/shared/sededespacho.service';
import { Producto } from 'src/model/producto.model';
import { ProductoService } from 'src/app/shared/producto.service';
import { Clasificacion } from 'src/model/clasificacion.model';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';

@Component({
  selector: 'app-generar-documento-individual',
  templateUrl: './generar-documento-individual.component.html',
  styleUrls: ['./generar-documento-individual.component.css']
})
export class GenerarDocumentoIndividualComponent implements OnInit, OnDestroy {

  constructor(
    private plazoDistribucionService: PlazoDistribucionService,
    private tipoSeguridadService: TipoSeguridadService,
    private tipoServicioService: TipoServicioService,
    private productoService: ProductoService,
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private distritoService: DistritoService,
    private buzonService: BuzonService,
    private envioService: EnvioService,
    private utilsService: UtilsService,
    private cargoPdfService: CargoPdfService,
    private modalService: BsModalService,
    private sedeDespachoService: SedeDespachoService,
    private clasificacionService: ClasificacionService
  ) { }

  documentoForm: FormGroup;
  documento: Documento = new Documento;
  autorizationFile: File; //-----------------------------------------------------
  buzon: Buzon;
  rutaManual: string = AppSettings.MANUAL_REGISTRO;
  departamento = {};
  provincia = {};


  plazosDistribucion: PlazoDistribucion[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  departamentos: Departamento[];
  provincias: Provincia[];
  distritos: Distrito[];
  productos: Producto[];
  clasificaciones: Clasificacion[];
  sedesDespacho: Sede[];
  plazoDistribucionPermitido: PlazoDistribucion;

  provinciasSubscription: Subscription;
  distritosSubscription: Subscription;
  productoSubscription: Subscription;
  clasificacionesSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  plazosDistribucionSubscription: Subscription;
  departamentosSubscription: Subscription;
  plazoDistribucionPermitidoSubscription: Subscription;
  buzonSubscription: Subscription;
  autogeneradoCreado: string = '';
  sedesSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.documentoForm = new FormGroup({
      'sedeDespacho': new FormControl(null, Validators.required),
      'nroDocumento': new FormControl(""),
      'plazoDistribucion': new FormControl(null, Validators.required),
      'clasificacion': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'producto': new FormControl(null, Validators.required),
      'comunicacionDestino': new FormGroup({
        'razonSocial': new FormControl(""),
        'contacto': new FormControl("")
      }, this.atLeastOne),
      'distrito': new FormControl(null, Validators.required),
      'telefono': new FormControl(""),
      'direccion': new FormControl("", Validators.required),
      'referencia': new FormControl(""),
      'cargoPropio': new FormControl("", Validators.required),
      'autorizacion': new FormControl(null, [this.requiredIfNoAutorizado.bind(this)])
    });
  }

  cargarDatosVista() {
    this.clasificaciones = this.clasificacionService.getClasificaciones();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.productos = this.productoService.getProductos();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    // this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.departamentos = this.departamentoService.getDepartamentosPeru();
    this.plazoDistribucionPermitido = this.plazoDistribucionService.getPlazoDistribucionPermitido();
    this.buzon = this.buzonService.getBuzonActual();
    this.sedesDespacho = this.sedeDespachoService.getSedesDespacho();

    this.clasificacionesSubscription = this.clasificacionService.clasificacionesChanged.subscribe(
      clasificaciones => {
        this.clasificaciones = clasificaciones;
      }
    )
    this.tiposServicioSubscription = this.tipoServicioService.tiposServicioChanged.subscribe(
      tiposServicio => {
        this.tiposServicio = tiposServicio;
      }
    )
    this.productoSubscription = this.productoService.productosChanged.subscribe(
      producto => {
        this.productos = producto;
      }
    )
    this.tiposSeguridadSubscription = this.tipoSeguridadService.tiposSeguridadChanged.subscribe(
      tiposSeguridad => {
        this.tiposSeguridad = tiposSeguridad;
      }
    )
    // this.plazosDistribucionSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
    //   plazosDistribucion => {
    //     this.plazosDistribucion = plazosDistribucion;
    //   }
    // )
    this.departamentosSubscription = this.departamentoService.departamentosPeruChanged.subscribe(
      departamentosPeru => {
        this.departamentos = departamentosPeru;
      }
    )
    this.plazoDistribucionPermitidoSubscription = this.plazoDistribucionService.plazoDistribucionPermitidoChanged.subscribe(
      plazoDistribucionPermitido => {
        this.plazoDistribucionPermitido = plazoDistribucionPermitido;
      }
    )
    this.buzonSubscription = this.buzonService.buzonActualChanged.subscribe(
      buzon => {
        this.buzon = buzon;
      }
    )
    this.sedesSubscription = this.sedeDespachoService.sedesDespachoChanged.subscribe(
      sedesDespacho => {
        this.sedesDespacho = sedesDespacho;
      }
    )

  }
  onDepartamentoSelectedChanged(departamento) {
    this.provinciasSubscription = this.provinciaService.listarProvinciaByDepartamentoId(departamento.id).subscribe(
      provincias => {
        this.provincias = provincias;
      }
    );
    this.distritos = [];
    this.plazosDistribucion = [];
  }
  onProvinciaSelectedChanged(provincia) {
    this.distritosSubscription = this.distritoService.listarDistritosByProvinciaId(provincia.id).subscribe(
      distritos => {
        this.distritos = distritos;
      }
    );
  }
  onDistritoSelectedChanged(distrito){
    this.distritosSubscription = this.plazoDistribucionService.listarPlazosDistribucionByDistritoId(distrito.id).subscribe(
      plazosDistribucion => {
        this.plazosDistribucion = plazosDistribucion
      }
    )
  }
  onPlazoDistribucionSelected() {
    this.autorizationFile = null;
    this.documentoForm.get("autorizacion").reset();
  }

  onSubmit() {
    let envio: Envio = new Envio();
    delete envio.inconsistenciasResultado;
    envio.buzon = this.buzon;
    envio.sede = this.documentoForm.get("sedeDespacho").value
    this.documento.contactoDestino = this.documentoForm.get("comunicacionDestino.contacto").value;
    this.documento.direccion = this.documentoForm.get("direccion").value;
    this.documento.distrito = this.documentoForm.get("distrito").value;
    this.documento.nroDocumento = this.documentoForm.get("nroDocumento").value;
    envio.clasificacion = this.documentoForm.get("clasificacion").value;
    envio.plazoDistribucion = this.documentoForm.get("plazoDistribucion").value;
    this.documento.razonSocialDestino = this.documentoForm.get("comunicacionDestino.razonSocial").value;
    this.documento.referencia = this.documentoForm.get("referencia").value;
    this.documento.telefono = this.documentoForm.get("telefono").value;
    envio.tipoSeguridad = this.documentoForm.get("tipoSeguridad").value;
    envio.tipoServicio = this.documentoForm.get("tipoServicio").value;
    envio.producto = this.documentoForm.get("producto").value;
    envio.addDocumento(this.documento);

    this.envioService.registrarEnvio(envio, this.autorizationFile, null, null).subscribe(
      envio => {

        this.autogeneradoCreado = envio.documentos[0].documentoAutogenerado;
        this.departamento = {};
        this.provincia = {};

        envio.documentos[0].distrito = this.documento.distrito;

        if (this.documentoForm.get("cargoPropio").value !== '1') {
          setTimeout(() => {
            this.cargoPdfService.generarPdfIndividual(envio, document.getElementById("codebar").children[0].children[0]);
          }, 200);
        }
        this.documentoForm.reset();

        let bsModalRef: BsModalRef = this.modalService.show(AutogeneradoCreadoModalComponent, {
          initialState: {
            autogenerado: envio.documentos[0].documentoAutogenerado
          }
        });

      },
      error => {
        console.log(error);
      }
    );
  }



  onChangeFile(file: File) {
    if (file == undefined || file == null) {
      this.autorizationFile = null;
      return;
    }
    this.autorizationFile = file;
  }

  ngOnDestroy() {
    this.provinciasSubscription.unsubscribe();
    this.distritosSubscription.unsubscribe();
  }

  // Validators

  atLeastOne(form: FormGroup): { [key: string]: boolean } | null {
    let controls = Object.keys(form.controls);
    let encuentra = false;
    controls.forEach(control => {
      if (form.controls[control].value !== "") {
        encuentra = true;
      }
    });

    if (encuentra) {
      return null;
    }
    return { 'groupRequired': true }

  }

  requiredIfNoAutorizado(control: FormControl): { [key: string]: boolean } | null {

    if (this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm) || this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.get("plazoDistribucion")) || this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.get("plazoDistribucion").value)) {
      return { 'requiredIfNoAutorizado': true }
    }

    if (this.documentoForm.get("plazoDistribucion").value.id > this.plazoDistribucionPermitido.id
      && (this.documentoForm.get("autorizacion") === null || this.documentoForm.get("autorizacion").value === "" || this.documentoForm.get("autorizacion").value === null)) {
      return { 'requiredIfNoAutorizado': true }
    }
    console.log(this.documentoForm.get("autorizacion"));
    return null;

  }


}
