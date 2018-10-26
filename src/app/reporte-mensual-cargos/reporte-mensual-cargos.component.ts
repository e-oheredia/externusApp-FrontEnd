import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { ProveedorService } from '../shared/proveedor.service';

@Component({
  selector: 'app-reporte-mensual-cargos',
  templateUrl: './reporte-mensual-cargos.component.html',
  styleUrls: ['./reporte-mensual-cargos.component.css']
})
export class ReporteMensualCargosComponent implements OnInit {

  constructor(
    public documentoService: DocumentoService,
    public notifier: NotifierService,
    public utilsService: UtilsService,
    public proveedorService: ProveedorService
  ) { }

  documentos = [];
  documentosSubscription: Subscription;
  documentoForm: FormGroup;

  ngOnInit() {
    this.documentoForm = new FormGroup({
      "fechaIni": new FormControl(null, Validators.required),
      "fechaFin": new FormControl(null, Validators.required)
    })
  }


  listarDocumentos(fechaIni: Date, fechaFin: Date) {

    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {


      this.documentosSubscription = this.documentoService.listarDocumentosUsuarioBCP(fechaIni, fechaFin).subscribe(
        documentos => {
          this.documentos = documentos;
          this.llenarDataSource();
        },
        error => {
          if (error.status === 400) {
            this.documentos = [];
            this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
          }
        }
      );
    }
    else {
      this.notifier.notify('error', 'SELECCIONE RANGO DE FECHAS');
    }
  }


  ngOnDestroy() {
    this.documentosSubscription.unsubscribe();
  }



  dataSource = [];

  llenarDataSource() {
      this.dataSource = [];

      let documentoCreado = {
          Estado: "Creado",
          cantidad: this.documentos.filter(
              documento => this.documentoService.getUltimoEstado(documento).id === 1).length
      }

      let documentoCustodiado = {
          Estado: "Custodiado",
          cantidad: this.documentos.filter(
              documento => this.documentoService.getUltimoEstado(documento).id === 2).length
      }

      this.dataSource.push(documentoCreado);
      this.dataSource.push(documentoCustodiado);
      console.log(this.dataSource);
  }






}
