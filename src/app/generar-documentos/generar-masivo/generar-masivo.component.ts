import { AppSettings } from '../../shared/app.settings';
import { EnvioMasivo } from '../../../model/enviomasivo.model';
import { Documento } from '../../../model/documento.model';
import { TipoDocumentoService } from '../../shared/tipodocumento.service';
import { PlazoDistribucionService } from '../../shared/plazodistribucion.service';
import { Buzon } from '../../../model/buzon.model';
import { BuzonService } from '../../shared/buzon.service';
import { TipoServicio } from '../../../model/tiposervicio.model';
import { PlazoDistribucion } from '../../../model/plazodistribucion.model';
import { DocumentoService } from '../../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoSeguridad } from '../../../model/tiposeguridad.model';
import { TipoDocumento } from '../../../model/tipodocumento.model';
import { Subscription } from 'rxjs';
import { TipoSeguridadService } from '../../shared/tiposeguridad.service';
import { TipoServicioService } from '../../shared/tiposervicio.service';
import { UtilsService } from '../../shared/utils.service';
import { EnvioMasivoService } from '../../shared/enviomasivo.service';
import { NotifierService } from 'angular-notifier';
import { LocalDataSource } from 'ng2-smart-table';
import { TipoPlazoDistribucion } from '../../../model/tipoplazodistribucion.model';


@Component({
  selector: 'app-generar-masivo',
  templateUrl: './generar-masivo.component.html',
  styleUrls: ['./generar-masivo.component.css']
})
export class GenerarMasivoComponent implements OnInit {

  constructor(private documentoService: DocumentoService, 
    private buzonService: BuzonService, 
    private plazoDistribucionService: PlazoDistribucionService, 
    private tipoSeguridadService: TipoSeguridadService, 
    private tipoDocumentoService: TipoDocumentoService, 
    private tipoServicioService: TipoServicioService, 
    private utilsService: UtilsService, 
    private envioMasivoService: EnvioMasivoService, 
    private notifier: NotifierService    
  ) { }

  rutaPlantilla: string = AppSettings.PANTILLA_MASIVO;
  masivoForm: FormGroup;
  plazosDistribucion: PlazoDistribucion[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  tiposDocumento: TipoDocumento[];
  plazoDistribucionPermitido: PlazoDistribucion = new PlazoDistribucion(0, "", new TipoPlazoDistribucion(0,""));
  buzon: Buzon; 
  excelFile: File;
  autorizacionFile: File;
  documentosCargados: Documento[] = [];
  envioMasivo: EnvioMasivo = new EnvioMasivo(); 
  columnsDocumentosCargados = {
    nroDocumento: {
      title: 'Nro Documento'
    },
    razonSocialDestino: {
      title: 'Razón Social'
    },
    contactoDestino: {
      title: 'Contacto'
    },
    departamentoNombre: {
      title: 'Departamento'
    },
    provinciaNombre: {
      title: 'Provincia'
    },
    distritoNombre: {
      title: 'Distrito'
    },
    direccion: {
      title: 'Dirección'
    },
    referencia : {
      title: 'Referencia'
    },
    telefono: {
      title: 'Teléfono'
    }
  };

  dataDocumentosCargados: LocalDataSource = new LocalDataSource();

  tableSettings = AppSettings.tableSettings;

  plazosDistribucionSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  tiposDocumentoSubscription: Subscription;
  plazoDistribucionPermitidoSubscription: Subscription;
  buzonSubscription: Subscription;

  ngOnInit() {
    this.tableSettings.columns = this.columnsDocumentosCargados; 
    this.cargarDatosVista();
    this.masivoForm = new FormGroup({
      'plazoDistribucion': new FormControl(null, Validators.required), 
      'tipoDocumento': new FormControl(null, Validators.required), 
      'tipoSeguridad': new FormControl(null, Validators.required), 
      'tipoServicio': new FormControl(null, Validators.required), 
      'excel': new FormControl(null, Validators.required), 
      'autorizacion': new FormControl(null, [this.requiredIfNoAutorizado.bind(this)])
    }, this.noDocumentsLoaded.bind(this));
  }

  cargarDatosVista() {

    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
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

  mostrarDocumentosCargados(file: File){
    this.documentoService.mostrarDocumentosCargados(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.documentosCargados = data;
        let dataDocumentosCargados = [];
        data.forEach(element => {
          dataDocumentosCargados.push({
            nroDocumento: element.nroDocumento,
            razonSocialDestino: element.razonSocialDestino,
            contactoDestino: element.contactoDestino,
            departamentoNombre: element.distrito.provincia.departamento.nombre,
            provinciaNombre: element.distrito.provincia.nombre,
            distritoNombre: element.distrito.nombre,
            direccion: element.direccion,
            referencia: element.referencia,
            telefono: element.telefono
          })
        });
        this.dataDocumentosCargados.load(dataDocumentosCargados);
        return;
      }
      this.notifier.notify('error', data.mensaje);
      this.dataDocumentosCargados = new LocalDataSource();
    });
  }

  onChangeExcelFile(file: File){
    if (file == null) {
      this.excelFile = null;
      this.dataDocumentosCargados = new LocalDataSource();
      this.documentosCargados = [];
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }

  onChangeAutorizacionFile(file: File){
    if (file == undefined || file == null) {
      this.autorizacionFile = null;
      return;
    }
    this.autorizacionFile = file;
  }

  importarExcel(){
    if (this.excelFile == null) {
      this.dataDocumentosCargados = new LocalDataSource();
      this.documentosCargados = [];
      return null;
    }
    this.mostrarDocumentosCargados(this.excelFile);
  }

  onSubmit(datosMasivo : FormGroup){
    this.envioMasivo.buzon = this.buzon;
    this.envioMasivo.plazoDistribucion = datosMasivo.get('plazoDistribucion').value;
    this.envioMasivo.tipoDocumento = datosMasivo.get("tipoDocumento").value;
    this.envioMasivo.tipoSeguridad = datosMasivo.get("tipoSeguridad").value;
    this.envioMasivo.tipoServicio = datosMasivo.get("tipoServicio").value;
    this.envioMasivo.documentos = this.documentosCargados;    
    this.envioMasivoService.registrarEnvioMasivo(this.envioMasivo, this.autorizacionFile).subscribe(
      envioMasivo => {        
        this.documentosCargados = [];
        this.dataDocumentosCargados = new LocalDataSource();
        this.masivoForm.reset();
        this.notifier.notify('success', 'Se ha registrado el Envío Masivo con Autogenerado: ' + envioMasivo.masivoAutogenerado);            
      },
      error => {
        console.log(error);
      }
    )
  }

  noDocumentsLoaded(form: FormGroup): { [key: string]: boolean } | null {
    if (this.documentosCargados.length == 0) {
      return { 'noDocumentsLoaded': true }  
    }    
    return null;
  }

  requiredIfNoAutorizado(control: FormControl): { [key: string]: boolean } | null {
    if (this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm) || this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion")) && this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion").value)) {
      return {'requiredIfNoAutorizado': true}
    }

    if ( !this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm) && !this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion")) && !this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion").value) && this.masivoForm.get("plazoDistribucion").value.id > this.plazoDistribucionPermitido.id 
    && (this.masivoForm.get("autorizacion") === null || this.masivoForm.get("autorizacion").value === "" || this.masivoForm.get("autorizacion").value === null)) {
      return {'requiredIfNoAutorizado': true}
    }
    return null;   
  }
}
