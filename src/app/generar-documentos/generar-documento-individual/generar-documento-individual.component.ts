import { AppSettings } from '../../shared/app.settings';
import { EnvioService } from '../../shared/envio.service';
import { Envio } from '../../../model/envio.model';
import { PlazoDistribucion } from '../../../model/plazodistribucion.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, RequiredValidator } from '@angular/forms';
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
import { TipoDocumento } from '../../../model/tipodocumento.model';
import { TipoDocumentoService } from '../../shared/tipodocumento.service';
import { Buzon } from '../../../model/buzon.model';
import { BuzonService } from '../../shared/buzon.service';
import { Documento } from '../../../model/documento.model';
import { DocumentoService } from '../../shared/documento.service';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../../shared/utils.service';
import { TipoPlazoDistribucion } from '../../../model/tipoplazodistribucion.model';

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
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private distritoService: DistritoService,
    private tipoDocumentoService: TipoDocumentoService,
    private buzonService: BuzonService, 
    private envioService: EnvioService, 
    private notifier: NotifierService, 
    private utilsService: UtilsService
  ) { }

  documentoForm: FormGroup;
  envio: Envio = new Envio();
  documento: Documento = new Documento;
  autorizationFile: File;
  buzon: Buzon;
  rutaManual: string = AppSettings.MANUAL_REGISTRO;
  departamento= {};
  provincia = {};


  plazosDistribucion: PlazoDistribucion[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  departamentos: Departamento[];
  provincias: Provincia[];
  distritos: Distrito[];
  tiposDocumento: TipoDocumento[];
  plazoDistribucionPermitido: PlazoDistribucion = new PlazoDistribucion(0, "", new TipoPlazoDistribucion(0,""), 0);

  provinciasSubscription: Subscription;
  distritosSubscription: Subscription;
  tiposDocumentoSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  plazosDistribucionSubscription: Subscription;
  departamentosSubscription: Subscription;
  plazoDistribucionPermitidoSubscription: Subscription;
  buzonSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.documentoForm = new FormGroup({
      'nroDocumento': new FormControl(""),
      'plazoDistribucion': new FormControl(null, Validators.required),
      'tipoDocumento': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'comunicacionDestino': new FormGroup({
        'razonSocial': new FormControl(""),
        'contacto': new FormControl("")
      }, this.atLeastOne),
      'distrito': new FormControl(null, Validators.required),
      'telefono': new FormControl(""),
      'direccion': new FormControl("", Validators.required),
      'referencia': new FormControl(""),
      'autorizacion': new FormControl(null, [this.requiredIfNoAutorizado.bind(this)])
    });
  }

  cargarDatosVista() {

    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.departamentos = this.departamentoService.getDepartamentosPeru();
    this.plazoDistribucionPermitido = this.plazoDistribucionService.getPlazoDistribucionPermitido();
    this.buzon = this.buzonService.getBuzonActual();

    this.tiposDocumentoSubscription = this.tipoDocumentoService.tiposDocumentoChanged.subscribe(
      tiposDocumento => {
        this.tiposDocumento = tiposDocumento;
      }
    )    
    this.tiposServicioSubscription = this.tipoServicioService.tiposServicioChanged.subscribe(
      tiposServicio => {
        this.tiposServicio = tiposServicio;
      }
    )
    this.tiposSeguridadSubscription = this.tipoSeguridadService.tiposSeguridadChanged.subscribe(
      tiposSeguridad => {
        this.tiposSeguridad = tiposSeguridad;
      }
    )
    this.plazosDistribucionSubscription = this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
      plazosDistribucion => {
        this.plazosDistribucion = plazosDistribucion;
      }
    )
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
      buzon =>{
        this.buzon = buzon;
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
  }
  onProvinciaSelectedChanged(provincia) {
    this.distritosSubscription = this.distritoService.listarDistritosByProvinciaId(provincia.id).subscribe(
      distritos => {
        this.distritos = distritos;
      }
    );
  }

  onPlazoDistribucionSelected() {
    this.autorizationFile = null;
    this.documentoForm.get("autorizacion").reset();
  }

  onSubmit() {
    this.envio.buzon = this.buzon;
    this.documento.contactoDestino = this.documentoForm.get("comunicacionDestino.contacto").value;
    this.documento.direccion = this.documentoForm.get("direccion").value;
    this.documento.distrito = this.documentoForm.get("distrito").value;
    this.documento.nroDocumento = this.documentoForm.get("nroDocumento").value;
    this.envio.plazoDistribucion = this.documentoForm.get("plazoDistribucion").value;
    this.documento.razonSocialDestino = this.documentoForm.get("comunicacionDestino.razonSocial").value;
    this.documento.referencia = this.documentoForm.get("referencia").value;
    this.documento.telefono = this.documentoForm.get("telefono").value;
    this.envio.tipoDocumento = this.documentoForm.get("tipoDocumento").value;
    this.envio.tipoSeguridad = this.documentoForm.get("tipoSeguridad").value;
    this.envio.tipoServicio = this.documentoForm.get("tipoServicio").value;
    this.envio.addDocumento(this.documento);   
     
    this.envioService.registrarEnvio(this.envio, this.autorizationFile).subscribe(
      envio => {

        this.notifier.notify('success', 'Se ha registrado el envío con autogenerado ' + envio.documentos[0].documentoAutogenerado);
        this.departamento = {};
        this.provincia = {};
        this.documentoForm.reset();
        this.envio = new Envio();
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
      return {'requiredIfNoAutorizado': true}
    }

    if (this.documentoForm.get("plazoDistribucion").value.id > this.plazoDistribucionPermitido.id 
    && (this.documentoForm.get("autorizacion") === null || this.documentoForm.get("autorizacion").value === "" || this.documentoForm.get("autorizacion").value === null)) {
      return {'requiredIfNoAutorizado': true}
    }
    console.log(this.documentoForm.get("autorizacion"));
    return null;   

  }


}
