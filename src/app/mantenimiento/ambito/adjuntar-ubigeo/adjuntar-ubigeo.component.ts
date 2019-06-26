import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/shared/utils.service';
import { NotifierService } from 'angular-notifier';
import { BuzonService } from 'src/app/shared/buzon.service';
import { AreaService } from 'src/app/shared/area.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-adjuntar-ubigeo',
  templateUrl: './adjuntar-ubigeo.component.html',
  styleUrls: ['./adjuntar-ubigeo.component.css']
})
export class AdjuntarUbigeoComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private utilsService: UtilsService,
    private notifierService: NotifierService,
    private buzonService: BuzonService,
    private areaService: AreaService
  ) { }

  excelForm: FormGroup;

  @Output() excelAdjuntadoEvent = new EventEmitter<File>();

  ngOnInit() {
    this.excelForm = new FormGroup({
      'archivoAdjunto': new FormControl(null, Validators.required),
    })
  }

}
