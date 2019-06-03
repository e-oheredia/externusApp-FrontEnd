import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { Documento } from 'src/model/documento.model';
import { DocumentoService } from 'src/app/shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuzonService } from 'src/app/shared/buzon.service';
import { UtilsService } from 'src/app/shared/utils.service';
import { Buzon } from 'src/model/buzon.model';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { AreaService } from 'src/app/shared/area.service';
import { Area } from 'src/model/area.model';

@Component({
  selector: 'app-adjuntar-correo',
  templateUrl: './adjuntar-correo.component.html',
  styleUrls: ['./adjuntar-correo.component.css']
})
export class AdjuntarCorreoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public utilsService: UtilsService,
    private notifier: NotifierService,
    private buzonService: BuzonService,
    private areaService: AreaService
  ) { }

  buzon: Buzon;
  area: Area;
  plazoDistribucion: PlazoDistribucion;
  correoForm: FormGroup;
  archivoAdjunto: File;
  valor: string;

  @Output() correoAdjuntadoEvent = new EventEmitter<File>();

  ngOnInit() {
    this.correoForm = new FormGroup({
      'archivoAdjunto': new FormControl(null, Validators.required),
    })
  }


  onChangeExcelFile(file: File) {
    this.archivoAdjunto = file;
    console.log("BUZON: " + this.buzon);
    console.log("BUZON: " + this.plazoDistribucion);
  }


  onSubmit(archivoAdjunto: File) {
    if (this.utilsService.isUndefinedOrNull(archivoAdjunto)) {
      this.notifier.notify("success", "Seleccione el archivo del correo");
      return;
    }

    if (this.valor === "buzon"){
      this.buzonService.actualizarPlazoDistribucionPermitido(this.buzon.id, this.plazoDistribucion, archivoAdjunto).subscribe(
        plazoDistribucion => {
          this.notifier.notify('success', 'Se ha asignado correctamente el plazo de distribución');
          this.correoAdjuntadoEvent.emit();
          this.bsModalRef.hide();
        }
      )
    } else {
      this.areaService.actualizarPlazoDistribucionPermitido(this.area.id, this.plazoDistribucion, archivoAdjunto).subscribe(
        plazoDistribucion => {
          this.notifier.notify('success', 'Se ha asignado correctamente el plazo de distribución');
          this.correoAdjuntadoEvent.emit();
          this.bsModalRef.hide();
        }
      )
    }
  }



}
