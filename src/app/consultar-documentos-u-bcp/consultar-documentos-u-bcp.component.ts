import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';

@Component({
    selector: 'app-consultar-documentos-u-bcp',
    templateUrl: './consultar-documentos-u-bcp.component.html',
    styleUrls: ['./consultar-documentos-u-bcp.component.css']
})

export class ConsultarDocumentosUBCPComponent implements OnInit {

    constructor(public documentoService: DocumentoService,
        private notifier: NotifierService,
        private utilsService: UtilsService) {

    }


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
                    this.documentos = documentos
                },
                error => {
                    if (error.status === 400) {
                        this.documentos = [];
                        this.notifier.notify('error', 'RANGO DE FECHA NO VALIDA');
                    }
                }
            );
        }
        else{
            this.notifier.notify('error', 'COMPLETE AMBAS FECHAS');
        }
    }



    ngOnDestroy() {
        this.documentosSubscription.unsubscribe();
    }

}