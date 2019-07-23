import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/shared/app.settings';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { Producto } from 'src/model/producto.model';
import { Clasificacion } from 'src/model/clasificacion.model';
import { TipoServicio } from 'src/model/tiposervicio.model';
import { Proveedor } from 'src/model/proveedor.model';
import { TipoSeguridad } from 'src/model/tiposeguridad.model';
import { Subscription } from 'rxjs';
import { PlazoDistribucionService } from 'src/app/shared/plazodistribucion.service';
import { ProductoService } from 'src/app/shared/producto.service';
import { ClasificacionService } from 'src/app/shared/clasificacion.service';
import { TipoServicioService } from 'src/app/shared/tiposervicio.service';
import { ProveedorService } from 'src/app/shared/proveedor.service';
import { TipoSeguridadService } from 'src/app/shared/tiposeguridad.service';
import { EnvioBloque } from 'src/model/enviobloque.model';
import { Buzon } from 'src/model/buzon.model';
import { BuzonService } from 'src/app/shared/buzon.service';
import { EnvioBloqueService } from 'src/app/shared/enviobloque.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AutogeneradoCreadoModalComponent } from '../autogenerado-creado-modal/autogenerado-creado-modal.component';
import { Documento } from 'src/model/documento.model';
import { DocumentoService } from 'src/app/shared/documento.service';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { InconsistenciaDocumento } from 'src/model/inconsistenciadocumento.model';
import { Region } from 'src/model/region.model';
import { RegionService } from 'src/app/shared/region.service';
import { ConfirmModalComponent } from 'src/app/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-generar-bloque',
  templateUrl: './generar-bloque.component.html',
  styleUrls: ['./generar-bloque.component.css']
})
export class GenerarBloqueComponent implements OnInit {

  constructor(
    private plazoDistribucionService: PlazoDistribucionService,
    private productoService: ProductoService,
    private clasificacionService: ClasificacionService,
    private tipoServicioService: TipoServicioService,
    private proveedorService: ProveedorService,
    private tipoSeguridadService: TipoSeguridadService,
    private buzonService: BuzonService,
    private envioBloqueService: EnvioBloqueService,
    private modalService: BsModalService,
    private documentoService: DocumentoService,
    private utilsService: UtilsService,
    private notifier: NotifierService,
    private regionService: RegionService,
  ) { }

  rutaPlantilla: string = AppSettings.PLANTILLA_MASIVO;

  bloqueForm: FormGroup;
  buzon: Buzon;
  autogeneradoCreado: string;
  proveedor: Proveedor;
  codigoGuia: string;

  plazosDistribucion: PlazoDistribucion[];
  region: Region;
  regiones: Region[];
  productos: Producto[];
  clasificaciones: Clasificacion[];
  tiposServicio: TipoServicio[];
  proveedores: Proveedor[];
  tiposSeguridad: TipoSeguridad[];
  excelFile: File;
  documentosCorrectos: Documento[] = [];
  documentosIncorrectos: InconsistenciaDocumento[] = [];

  documentosEnBloque: Documento[] = [];

  plazosDistribucionSubscription: Subscription;
  productosSubscription: Subscription;
  clasificacionesSubscription: Subscription;
  tiposServicioSubscription: Subscription;
  proveedoresSubscription: Subscription;
  tiposSeguridadSubscription: Subscription;
  buzonSubscription: Subscription;
  regionSubscription: Subscription;

  ngOnInit() {
    this.cargarDatosVista();
    this.bloqueForm = new FormGroup({
      'cantidadCorrectos': new FormControl(""),
      'cantidadIncorrectos': new FormControl(""),
      'region': new FormControl(null, Validators.required),
      'plazoDistribucion': new FormControl(null, Validators.required),
      'tipoServicio': new FormControl(null, Validators.required),
      'tipoSeguridad': new FormControl(null, Validators.required),
      'clasificacion': new FormControl(null, Validators.required),
      'proveedor': new FormControl(null, Validators.required),      
      'producto': new FormControl(null, Validators.required),
      'codigoGuia': new FormControl(null, Validators.required),
      'excel': new FormControl(null, Validators.required)
    })
  }

  cargarDatosVista() {
    this.productos = this.productoService.getProductos();
    this.clasificaciones = this.clasificacionService.getClasificaciones();
    this.tiposServicio = this.tipoServicioService.getTiposServicio();
    this.proveedores = this.proveedorService.getProveedores();
    this.tiposSeguridad = this.tipoSeguridadService.getTiposSeguridad();
    this.buzon = this.buzonService.getBuzonActual();
    this.regiones = this.regionService.getRegiones();

    this.productosSubscription = this.productoService.productosChanged.subscribe(
      productos => {
        this.productos = productos
      }
    )
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
    this.proveedoresSubscription = this.proveedorService.proveedoresChanged.subscribe(
      proveedores => {
        this.proveedores = proveedores;
      }
    )
    this.tiposSeguridadSubscription = this.tipoSeguridadService.tiposSeguridadChanged.subscribe(
      tiposSeguridad => {
        this.tiposSeguridad = tiposSeguridad;
      }
    )
    this.buzonSubscription = this.buzonService.buzonActualChanged.subscribe(
      buzon => {
        this.buzon = buzon;
      }
    )
    this.regionSubscription = this.regionService.regionesChanged.subscribe(
      regiones => {
        this.regiones = regiones;
      }
    )
  }
  
  onRegionSelectedChanged(region){
    this.plazosDistribucionSubscription = this.plazoDistribucionService.listarPlazosDistribucionByRegionId(region.id).subscribe(
      plazos => {
        this.plazosDistribucion = plazos;
      }
    );
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
        this.documentosCorrectos = this.documentosCorrectos.concat(data.documentos);
        this.documentosIncorrectos = data.inconsistenciasDocumento;
        if(this.utilsService.isUndefinedOrNullOrEmpty(this.documentosIncorrectos)){
          this.documentosIncorrectos = [];
        }
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



  onSubmit(datosBloque: FormGroup) {
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
          this.registrarBloque(datosBloque);
        }
      )
    } else {
      this.registrarBloque(datosBloque);
    }
  }

  registrarBloque(datosBloque: FormGroup) {
    let envioBloque: EnvioBloque = new EnvioBloque();
    delete envioBloque.inconsistenciasResultado;
    envioBloque.buzon = this.buzon;
    envioBloque.plazoDistribucion = datosBloque.get('plazoDistribucion').value;
    envioBloque.producto = datosBloque.get('producto').value;
    envioBloque.clasificacion = datosBloque.get('clasificacion').value;
    envioBloque.tipoServicio = datosBloque.get('tipoServicio').value;
    envioBloque.tipoSeguridad = datosBloque.get('tipoSeguridad').value;
    envioBloque.documentos = this.documentosCorrectos;
    envioBloque.inconsistenciasDocumento = this.documentosIncorrectos;
    this.codigoGuia = datosBloque.get('codigoGuia').value;
    this.proveedor = datosBloque.get('proveedor').value;
    this.envioBloqueService.registrarEnvioBloque(envioBloque, this.codigoGuia, this.proveedor.id).subscribe(
      envioBloque => {
        this.documentosCorrectos = [];
        this.documentosIncorrectos = [];
        this.autogeneradoCreado = envioBloque.masivoAutogenerado
        let bsModalRef: BsModalRef = this.modalService.show(AutogeneradoCreadoModalComponent, {
          initialState: {
            autogenerado: envioBloque.masivoAutogenerado
          }
        });
        this.bloqueForm.reset();
      },
      error => {
        console.log(error);
      }
    )
  }



}
