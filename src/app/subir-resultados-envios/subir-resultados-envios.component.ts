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
    private documentoService: DocumentoService
  ) { }

  rutaPlantilla: string = AppSettings.PANTILLA_MASIVO;

  ngOnInit() {

  }

  

}
