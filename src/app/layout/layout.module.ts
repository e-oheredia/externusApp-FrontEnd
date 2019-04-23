import { AutogeneradoCreadoModalComponent } from './../generar-documentos/autogenerado-creado-modal/autogenerado-creado-modal.component';
import { CargoPdfService } from './../shared/cargo-pdf.service';
import { BrowserModule } from '@angular/platform-browser';
import { EstadoDocumentoService } from './../shared/estadodocumento.service';
import { AreaService } from './../shared/area.service';
import { WriteExcelService } from './../shared/write-excel.service';
import { BrowserStorageService } from '../shared/browserstorage.service';
import { DocumentoGuiaService } from '../shared/documentoguia.service';
import { GuiaService } from '../shared/guia.service';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ReadExcelService } from '../shared/read-excel.service';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RequesterService } from '../shared/requester.service';
import { EmpleadoService } from '../shared/empleado.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageModule } from "angular-2-local-storage";
import { BuzonService } from '../shared/buzon.service';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { TipoServicioService } from '../shared/tiposervicio.service';
import { TipoSeguridadService } from '../shared/tiposeguridad.service';
import { DepartamentoService } from '../shared/departamento.service';
import { ProvinciaService } from '../shared/provincia.service';
import { DistritoService } from '../shared/distrito.service';
import { DocumentoService } from '../shared/documento.service';
import { UtilsService } from '../shared/utils.service';
import { EnvioService } from '../shared/envio.service';
import { EnvioMasivoService } from '../shared/enviomasivo.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProveedorService } from '../shared/proveedor.service';
import { AuthInterceptor } from '../shared/auth-interceptor';
import { NgSelectModule } from "@ng-select/ng-select";
import { OrderModule } from 'ngx-order-pipe';
import { MenuService } from '../shared/menu.service';
import { TreeViewComponent } from './header/tree-view/tree-view.component';
import { SedeDespachoService } from '../shared/sededespacho.service';
import { TrackingDocumentoComponent } from '../modals/tracking-documento/tracking-documento.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TituloComponent } from './titulo/titulo.component';
import { TituloService } from '../shared/titulo.service';
import { MensajeExitoComponent } from '../modals/mensaje-exito/mensaje-exito.component';
import { AgregarPlazoComponent } from '../mantenimiento/plazo-distribucion/agregar-plazo/agregar-plazo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarProveedorComponent } from '../mantenimiento/proveedor/agregar-proveedor/agregar-proveedor.component';
import { ModificarPlazoComponent } from '../mantenimiento/plazo-distribucion/modificar-plazo/modificar-plazo.component';
import { ModificarProveedorComponent } from '../mantenimiento/proveedor/modificar-proveedor/modificar-proveedor.component';
import { TipoPlazoDistribucionService } from '../shared/tipoplazodistribucion.service';
import { AgregarTipoSeguridadComponent } from '../mantenimiento/tipo-seguridad/agregar-tipo-seguridad/agregar-tipo-seguridad.component';
import { ModificarTipoSeguridadComponent } from '../mantenimiento/tipo-seguridad/modificar-tipo-seguridad/modificar-tipo-seguridad.component';
import { AdjuntarArchivoComponent } from '../modals/adjuntar-archivo/adjuntar-archivo.component';
import { AgregarTipoServicioComponent } from '../mantenimiento/tipo-servicio/agregar-tiposervicio/agregar-tiposervicio.component';
import { ModificarTipoServicioComponent } from '../mantenimiento/tipo-servicio/modificar-tiposervicio/modificar-tiposervicio.component';
import { ProductoService } from '../shared/producto.service';
import { AgregarProductoComponent } from '../mantenimiento/producto/agregar-producto/agregar-producto.component';
import { ModificarProductoComponent } from '../mantenimiento/producto/modificar-producto/modificar-producto.component';
import { AgregarSubambitoComponent } from '../mantenimiento/subambito/agregar-subambito/agregar-subambito.component';
import { ModificarSubambitoComponent } from '../mantenimiento/subambito/modificar-subambito/modificar-subambito.component';
import { SubAmbitoService } from '../shared/subambito.service';
import { AmbitoService } from '../shared/ambito.service';
import { ClasificacionService } from '../shared/clasificacion.service';
import { AgregarClasificacionComponent } from '../mantenimiento/clasificacion/agregar-clasificacion/agregar-clasificacion.component';
import { ModificarClasificacionComponent } from '../mantenimiento/clasificacion/modificar-clasificacion/modificar-clasificacion.component';
import { EnvioBloqueService } from '../shared/enviobloque.service';
import { EliminarGuiabloqueComponent } from '../listar-guiasbloque-creadas/eliminar-guiabloque/eliminar-guiabloque.component';
import { ModificarGuiabloqueComponent } from '../listar-guiasbloque-creadas/modificar-guiabloque/modificar-guiabloque.component';
import { EnviarGuiabloqueComponent } from '../listar-guiasbloque-creadas/enviar-guiabloque/enviar-guiabloque.component';


@NgModule({
  declarations: [
    HeaderComponent, 
    ConfirmModalComponent, 
    TreeViewComponent, 
    AutogeneradoCreadoModalComponent,
    TrackingDocumentoComponent,
    TituloComponent,
    MensajeExitoComponent,
    AgregarPlazoComponent,
    AgregarProveedorComponent,
    ModificarPlazoComponent,
    ModificarProveedorComponent,
    AgregarTipoSeguridadComponent,
    ModificarTipoSeguridadComponent,
    AdjuntarArchivoComponent,
    AgregarTipoServicioComponent,
    ModificarTipoServicioComponent,
    AgregarProductoComponent,
    ModificarProductoComponent,
    AgregarSubambitoComponent,
    ModificarSubambitoComponent,
    AgregarClasificacionComponent,
    ModificarClasificacionComponent,
    EliminarGuiabloqueComponent,
    ModificarGuiabloqueComponent,
    EnviarGuiabloqueComponent
  ],
  imports: [  
    HttpClientModule,
    BrowserModule,
    LocalStorageModule.withConfig({
      prefix: '',
      storageType: 'localStorage'
    }),
    ModalModule.forRoot(), 
    NgSelectModule, 
    Ng2SmartTableModule,
    OrderModule, 
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent
  ], 
  providers: [
    RequesterService,
    EmpleadoService, 
    BuzonService, 
    PlazoDistribucionService, 
    TipoServicioService, 
    TipoSeguridadService, 
    DepartamentoService, 
    ProvinciaService, 
    DistritoService,
    DocumentoService, 
    ReadExcelService, 
    UtilsService, 
    EnvioService, 
    EnvioMasivoService, 
    BsModalRef, 
    BsModalService, 
    ProveedorService,
    TipoPlazoDistribucionService,
    GuiaService, 
    DocumentoGuiaService, 
    BrowserStorageService,
    {provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true}, 
    WriteExcelService, 
    AreaService, 
    EstadoDocumentoService, 
    MenuService, 
    CargoPdfService,
    SedeDespachoService,
    TituloService,
    ProductoService,
    AmbitoService,
    SubAmbitoService,
    ClasificacionService,
    EnvioBloqueService
  ], 
  entryComponents: [ 
    ConfirmModalComponent, 
    AutogeneradoCreadoModalComponent,
    AgregarPlazoComponent,
    AgregarProveedorComponent,
    TrackingDocumentoComponent,
    MensajeExitoComponent,
    ModificarPlazoComponent,
    ModificarProveedorComponent,
    AgregarTipoSeguridadComponent,
    ModificarTipoSeguridadComponent,
    ModificarTipoSeguridadComponent,
    AdjuntarArchivoComponent,
    AgregarTipoServicioComponent,
    ModificarTipoServicioComponent,
    AgregarProductoComponent,
    ModificarProductoComponent,
    AgregarSubambitoComponent,
    ModificarSubambitoComponent,    
    AgregarClasificacionComponent,
    ModificarClasificacionComponent,
    EliminarGuiabloqueComponent,
    ModificarGuiabloqueComponent,
    EnviarGuiabloqueComponent
   ],
})
export class LayoutModule { }
