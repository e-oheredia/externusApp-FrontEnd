import { AutogeneradoCreadoModalComponent } from './../autogenerado-creado-modal/autogenerado-creado-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CargoPdfService } from './../../shared/cargo-pdf.service';
import { AppSettings } from '../../shared/app.settings';
import { EnvioMasivo } from '../../../model/enviomasivo.model';
import { Documento } from '../../../model/documento.model';
import { PlazoDistribucionService } from '../../shared/plazodistribucion.service';
import { Buzon } from '../../../model/buzon.model';
import { BuzonService } from '../../shared/buzon.service';
import { TipoServicio } from '../../../model/tiposervicio.model';
import { PlazoDistribucion } from '../../../model/plazodistribucion.model';
import { DocumentoService } from '../../shared/documento.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoSeguridad } from '../../../model/tiposeguridad.model';
import { Subscription } from 'rxjs';
import { TipoSeguridadService } from '../../shared/tiposeguridad.service';
import { TipoServicioService } from '../../shared/tiposervicio.service';
import { UtilsService } from '../../shared/utils.service';
import { EnvioMasivoService } from '../../shared/enviomasivo.service';
import { NotifierService } from 'angular-notifier';
import { LocalDataSource } from 'ng2-smart-table';
import { TipoPlazoDistribucion } from '../../../model/tipoplazodistribucion.model';
import { SedeDespachoService } from 'src/app/shared/sededespacho.service';
import { Sede } from 'src/model/sede.model';
import { ProductoService } from 'src/app/shared/producto.service';
import { Producto } from 'src/model/producto.model';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';
import { Clasificacion } from 'src/model/clasificacion.model';


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
    private clasificacionService: ClasificacionService,
    private tipoServicioService: TipoServicioService, 
    private utilsService: UtilsService, 
    private envioMasivoService: EnvioMasivoService, 
    private notifier: NotifierService, 
    private cargoPdfService: CargoPdfService, 
    private modalService: BsModalService,
    private sedeDespachoService: SedeDespachoService,
    private productoService: ProductoService
  ) { }

  rutaPlantilla: string = AppSettings.PANTILLA_MASIVO;
  masivoForm: FormGroup;
  plazosDistribucion: PlazoDistribucion[];
  productos: Producto[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  clasificaciones: Clasificacion[];
  sedesDespacho: Sede[];
  plazoDistribucionPermitido: PlazoDistribucion = new PlazoDistribucion(0, "", new TipoPlazoDistribucion(0,""), 0, true);
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
  sedesSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  clasificacionesSubscription: Subscription;
  productoSubscription: Subscription;
  plazoDistribucionPermitidoSubscription: Subscription;
  buzonSubscription: Subscription;
  autogeneradoCreado: string;

  ngOnInit() {
    this.tableSettings.columns = this.columnsDocumentosCargados; 
    this.cargarDatosVista();
    this.masivoForm = new FormGroup({
      'sedeDespacho': new FormControl(null, Validators.required),
      'clasificacion': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required), 
      'producto': new FormControl(null, Validators.required), 
      'tipoSeguridad': new FormControl(null, Validators.required), 
      'tipoServicio': new FormControl(null, Validators.required), 
      'excel': new FormControl(null, Validators.required), 
      'autorizacion': new FormControl(null, [this.requiredIfNoAutorizado.bind(this)])
    }, this.noDocumentsLoaded.bind(this));
  }

  cargarDatosVista() {
    this.sedesDespacho = this.sedeDespachoService.getSedesDespacho();
    this.clasificaciones = this.clasificacionService.getClasificaciones();
    this.productos = this.productoService.getProductos();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    this.plazosDistribucion = this.plazoDistribucionService.getPlazosDistribucion();
    this.plazoDistribucionPermitido = this.plazoDistribucionService.getPlazoDistribucionPermitido();
    this.buzon = this.buzonService.getBuzonActual();

    this.clasificacionesSubscription = this.clasificacionService.clasificacionesChanged.subscribe(
      clasificaciones => {
        this.clasificaciones = clasificaciones;
      }
    )
    this.productoSubscription = this.productoService.productosChanged.subscribe(
      producto => {
        this.productos = producto;
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
    this.sedesSubscription = this.sedeDespachoService.sedesDespachoChanged.subscribe(
      sedesDespacho => {
        this.sedesDespacho = sedesDespacho;
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
    this.envioMasivo.sede = datosMasivo.get('sedeDespacho').value;
    this.envioMasivo.plazoDistribucion = datosMasivo.get('plazoDistribucion').value;
    this.envioMasivo.clasificacion = datosMasivo.get("clasificacion").value;
    this.envioMasivo.tipoSeguridad = datosMasivo.get("tipoSeguridad").value;
    this.envioMasivo.tipoServicio = datosMasivo.get("tipoServicio").value;
    this.envioMasivo.documentos = this.documentosCargados;    
    this.envioMasivo.producto = datosMasivo.get("producto").value;
    this.envioMasivoService.registrarEnvioMasivo(this.envioMasivo, this.autorizacionFile).subscribe(
      envioMasivo => {        
        this.documentosCargados = [];
        this.dataDocumentosCargados = new LocalDataSource();
        this.autogeneradoCreado = envioMasivo.masivoAutogenerado;        
        setTimeout(() =>{
          this.cargoPdfService.generarPdfMasivo(envioMasivo, document.getElementById("codebarMasivo").children[0].children[0]);
        }, 200);
        let bsModalRef: BsModalRef = this.modalService.show(AutogeneradoCreadoModalComponent, {
          initialState : {
            autogenerado: envioMasivo.masivoAutogenerado
          }
        });
        this.masivoForm.reset();
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
