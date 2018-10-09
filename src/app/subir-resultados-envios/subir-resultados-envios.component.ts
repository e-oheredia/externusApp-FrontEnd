import { GuiaService } from './../shared/guia.service';
import { DocumentoService } from './../shared/documento.service';
import { AppSettings } from './../shared/app.settings';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subir-resultados-envios',
  templateUrl: './subir-resultados-envios.component.html',
  styleUrls: ['./subir-resultados-envios.component.css']
})
export class SubirResultadosEnviosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService, 
    public guiaService: GuiaService
  ) { }

  rutaPlantilla: string = AppSettings.PANTILLA_MASIVO;

  ngOnInit() {
    
  }

  

}
