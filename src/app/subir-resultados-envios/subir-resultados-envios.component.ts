import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoDocumentoService } from './../shared/estadodocumento.service';
import { EstadoDocumentoEnum } from './../enum/estadodocumento.enum';
import { GuiaService } from './../shared/guia.service';
import { DocumentoService } from './../shared/documento.service';
import { AppSettings } from './../shared/app.settings';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from '../../../node_modules/angular-notifier';

@Component({
  selector: 'app-subir-resultados-envios',
  templateUrl: './subir-resultados-envios.component.html',
  styleUrls: ['./subir-resultados-envios.component.css']
})
export class SubirResultadosEnviosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService, 
    public guiaService: GuiaService, 
    private estadoDocumentoService: EstadoDocumentoService, 
    private utilsService: UtilsService, 
    private notifier: NotifierService
  ) { }

  rutaPlantillaResultados: string = AppSettings.PANTILLA_RESULTADOS;  
  estadoDocumentoEnum = EstadoDocumentoEnum;
  guiasSinCerrar = [];
  excelFile: File;
  excelForm: FormGroup;


  ngOnInit() {
    this.listarGuiasSinCerrar();
  }

  listarGuiasSinCerrar(){
    this.excelForm = new FormGroup({
      'excelFile': new FormControl('', Validators.required)
    });
    this.guiaService.listarGuiasSinCerrar().subscribe(
      guiasSinCerrar => this.guiasSinCerrar = guiasSinCerrar      
    )
  }

  onChangeExcelFile(file: File){
    this.excelFile = file;
  }

  onSubmit(excelFile: File){
    if (this.utilsService.isUndefinedOrNull(excelFile)) {
      this.notifier.notify("success","Seleccione el archivo excel a subir");
      return;
    }
    this.subirResutados(excelFile);
  }

  subirResutados(file: File){
    this.documentoService.mostrarResultadosDocumentosProveedor(file, 0, (data) => {
      if (this.utilsService.isUndefinedOrNullOrEmpty(data.mensaje)) {   
        this.documentoService.actualizarResultadosProveedor(data).subscribe(
          respuesta => {
            this.notifier.notify('success', respuesta.mensaje);
            this.excelForm.reset();
            this.listarGuiasSinCerrar();
          }, 
          error => {
            this.notifier.notify('error', error.error.mensaje);
          }
        )
        return;
      }     
      this.notifier.notify('error', data.mensaje);
    })
  }


  
}
