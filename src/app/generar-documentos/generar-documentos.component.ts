import { PlazoDistribucion } from '../../model/plazodistribucion.model';
import { TipoSeguridadService } from '../shared/tiposeguridad.service';
import { TipoServicioService } from '../shared/tiposervicio.service';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { TipoSeguridad } from '../../model/tiposeguridad.model';
import { TipoServicio } from '../../model/tiposervicio.model';
import { TipoDocumentoService } from '../shared/tipodocumento.service';
import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../model/tipodocumento.model';

@Component({
  selector: 'app-generar-documentos',
  templateUrl: './generar-documentos.component.html',
  styleUrls: ['./generar-documentos.component.css']
})
export class GenerarDocumentosComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
    
  }

}


