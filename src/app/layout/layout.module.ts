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
import { TipoDocumentoService } from '../shared/tipodocumento.service';
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

@NgModule({
  imports: [  
    HttpClientModule,
    BrowserModule,
    LocalStorageModule.withConfig({
      prefix: '',
      storageType: 'localStorage'
    }),
    ModalModule.forRoot(), 
    NgSelectModule, 
    OrderModule, 
    BsDropdownModule.forRoot()
    
  ],
  declarations: [
    HeaderComponent, 
    ConfirmModalComponent, TreeViewComponent
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
    TipoDocumentoService, 
    DocumentoService, 
    ReadExcelService, 
    UtilsService, 
    EnvioService, 
    EnvioMasivoService, 
    BsModalRef, 
    BsModalService, 
    ProveedorService,
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
    CargoPdfService
  ], 
  entryComponents: [ 
    ConfirmModalComponent
   ],
})
export class LayoutModule { }
