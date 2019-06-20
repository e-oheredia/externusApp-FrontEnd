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
import { InconsistenciaDocumento } from 'src/model/inconsistenciadocumento.model';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';


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

  rutaPlantilla: string = AppSettings.PLANTILLA_MASIVO;
  masivoForm: FormGroup;
  plazosDistribucion: PlazoDistribucion[];
  productos: Producto[];
  tiposSeguridad: TipoSeguridad[];
  tiposServicio: TipoServicio[];
  clasificaciones: Clasificacion[];
  sedesDespacho: Sede[];
  plazoDistribucionPermitido: PlazoDistribucion = new PlazoDistribucion(0, "", new TipoPlazoDistribucion(0, ""),"", 0, true);
  buzon: Buzon;
  excelFile: File;
  autorizacionFile: File;
  documentosCorrectos: Documento[] = [];
  documentosIncorrectos: InconsistenciaDocumento[] = [];
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
    referencia: {
      title: 'Referencia'
    },
    telefono: {
      title: 'Teléfono'
    }
  };

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
      'cantidadDocumentos': new FormControl(""),
      'cantidadCorrectos': new FormControl(""),
      'cantidadIncorrectos': new FormControl(""),
      'sedeDespacho': new FormControl(null, Validators.required),
      'clasificacion': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required),
      'producto': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'excel': new FormControl(null, Validators.required),
      'excel2': new FormControl(null),
      'autorizacion': new FormControl(null, [this.requiredIfNoAutorizado.bind(this)])
    });
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


  onChangeExcelFile(file: File) {
    if (file == null) {
      this.excelFile = null;
      this.documentosCorrectos = [];
      this.documentosIncorrectos = [];
      return null;
    }
    this.excelFile = file;
    this.importarExcel();
  }


  importarExcel() {
    if (this.excelFile == null) {
      return null;
    }
    if (this.documentosIncorrectos.length > 0) {
      this.mostrarDocumentosCargados2(this.excelFile);
      return;
    }
    this.mostrarDocumentosCargados(this.excelFile);
  }

  mostrarDocumentosCargados(file: File) {
    this.documentoService.validarDocumentosMasivosYBloque(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        this.documentosCorrectos = data.documentos;
        this.documentosIncorrectos = data.inconsistenciasDocumento;
        // descargar inconsistencias
        if (this.documentosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.documentosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  mostrarDocumentosCargados2(file: File) {
    this.documentoService.validarDocumentosMasivosYBloque(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {
        console.log("primeros correctos: " + this.documentosCorrectos.length)
        console.log("nuevos correctos: " + data.documentos.length)
        this.documentosCorrectos = this.documentosCorrectos.concat(data.documentos);
        this.documentosIncorrectos = data.inconsistenciasDocumento;
        // descargar inconsistencias
        if (this.documentosIncorrectos.length > 0) {
          this.descargarInconsistencias(this.documentosIncorrectos);
        }
        return;
      }
      this.notifier.notify('error', data.mensaje);
    });
  }

  descargarInconsistencias(inconsistencias: InconsistenciaDocumento[]) {
    this.documentoService.exportarInconsistenciasMasivoyBloque(inconsistencias);
  }

  onChangeAutorizacionFile(file: File) {
    if (file == undefined || file == null) {
      this.autorizacionFile = null;
      return;
    }
    this.autorizacionFile = file;
  }

  onSubmit(datosMasivo: FormGroup) {
    if (this.documentosIncorrectos.length > 0) {
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          titulo: "Confirmación de registros",
          mensaje: "Cantidad de documentos correctos : " + this.documentosCorrectos.length,
          mensaje2: "Cantidad de documentos incorrectos : "+this.documentosIncorrectos.length, 
          mensaje3: "Solo se subirán los documentos correctos. ¿Desea Continuar?" 
        }
      });
  
      bsModalRef.content.confirmarEvent.subscribe(
        () => {
          this.registrarMasivo(datosMasivo);
        }
      )
    } else {
      this.registrarMasivo(datosMasivo);
    }
  }

  registrarMasivo(datosMasivo: FormGroup) {
    let envioMasivo: EnvioMasivo = new EnvioMasivo();
    delete envioMasivo.inconsistenciasResultado;
    envioMasivo.buzon = this.buzon;
    envioMasivo.sede = datosMasivo.get('sedeDespacho').value;
    envioMasivo.plazoDistribucion = datosMasivo.get('plazoDistribucion').value;
    envioMasivo.clasificacion = datosMasivo.get("clasificacion").value;
    envioMasivo.tipoSeguridad = datosMasivo.get("tipoSeguridad").value;
    envioMasivo.tipoServicio = datosMasivo.get("tipoServicio").value;
    envioMasivo.documentos = this.documentosCorrectos;
    envioMasivo.inconsistenciasDocumento = this.documentosIncorrectos;
    envioMasivo.producto = datosMasivo.get("producto").value;
    this.envioMasivoService.registrarEnvioMasivo(envioMasivo, this.autorizacionFile).subscribe(
      envioMasivo => {
        this.documentosCorrectos = [];
        this.documentosIncorrectos = [];
        this.autogeneradoCreado = envioMasivo.masivoAutogenerado;
        setTimeout(() => {
          this.cargoPdfService.generarPdfMasivo(envioMasivo, document.getElementById("codebarMasivo").children[0].children[0]);
        }, 200);
        let bsModalRef: BsModalRef = this.modalService.show(AutogeneradoCreadoModalComponent, {
          initialState: {
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
    if (this.documentosCorrectos.length == 0) {
      return { 'noDocumentsLoaded': true }
    }
    return null;
  }

  requiredIfNoAutorizado(control: FormControl): { [key: string]: boolean } | null {
    if (this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm) || this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion")) && this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion").value)) {
      return { 'requiredIfNoAutorizado': true }
    }

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm) && !this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion")) && !this.utilsService.isUndefinedOrNullOrEmpty(this.masivoForm.get("plazoDistribucion").value) && this.masivoForm.get("plazoDistribucion").value.id > this.plazoDistribucionPermitido.id
      && (this.masivoForm.get("autorizacion") === null || this.masivoForm.get("autorizacion").value === "" || this.masivoForm.get("autorizacion").value === null)) {
      return { 'requiredIfNoAutorizado': true }
    }
    return null;
  }
}
