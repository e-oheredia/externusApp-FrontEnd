import { EnvioMasivo } from './../../model/enviomasivo.model';
import { Envio } from './../../model/envio.model';
import { Injectable } from "@angular/core";
import * as jsPDF from "jspdf";
import { UtilsService } from "./utils.service";


@Injectable()
export class CargoPdfService {


    constructor(
        private utilsService: UtilsService
    ) { 

    }

    doc = new jsPDF("p", "mm", "a4");
    PAGE_WIDTH = this.doc.internal.pageSize.getWidth();
    PAGE_HEIGHT = this.doc.internal.pageSize.getHeight();
    CODIGO_BARRAS_WIDTH = 150
    ESCALA_IMAGEN = 1.24


    generarPdfIndividual(envio: Envio, codigoBarrasSvg: any) {
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarrasSvg);
        var svgSize = codigoBarrasSvg.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            this.doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            this.doc.text(40, 20, 'EXTERNUS - ENVÍO INDIVIDUAL');
            this.doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            this.doc.setFontSize(12);
            let info = {
                'DE:': envio.buzon.nombre, 
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PARA:': envio.documentos[0].razonSocialDestino + ' - ' +  envio.documentos[0].contactoDestino, 
                'DIRECCION:': envio.documentos[0].direccion + ', ' +  envio.documentos[0].distrito.nombre + ', ' +  envio.documentos[0].distrito.provincia.nombre + ', ' + envio.documentos[0].distrito.provincia.departamento.nombre, 
                'PLAZO DISTRIBUCIÓN:': envio.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': envio.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': envio.tipoServicio.nombre
            }
            this.escribirInformacionPdf(this.doc, info, 160);

            this.doc.save(envio.documentos[0].documentoAutogenerado + '.pdf');  
            this.doc = new jsPDF("p", "mm", "a4");      
            canvas = null;
        }
        image.src = codigoBarrasBase64;
    }

    generarPdfMasivo(envio: EnvioMasivo, codigoBarrasSvg: any) {
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarrasSvg);
        var svgSize = codigoBarrasSvg.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            this.doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            this.doc.text(40, 20, 'EXTERNUS - ENVÍO MASIVO');
            this.doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            this.doc.setFontSize(12);
            let info = {
                'DE:': envio.buzon.nombre, 
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PLAZO DISTRIBUCIÓN:': envio.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': envio.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': envio.tipoServicio.nombre
            }
            this.escribirInformacionPdf(this.doc, info, 160);

            this.doc.save(envio.masivoAutogenerado + '.pdf');  
            this.doc = new jsPDF("p", "mm", "a4");      
            canvas = null;
        }
        image.src = codigoBarrasBase64;
    }

    escribirInformacionPdf(doc, info: any, y) {
        let keys = Object.keys(info);
        var salto = 0
        var lineasDeMas = 0
        var w = doc.getStringUnitWidth('Text') * 12;
        keys.forEach(key => {
            let clave = key; 
            let valor = info[key];
            let splitValor = doc.splitTextToSize(valor, 110);
            y += salto + lineasDeMas;
            doc.text(20, y, clave);
            doc.text(80, y, splitValor);
            lineasDeMas = (splitValor.length - 1) * w;
            salto = 10;
        });
    }







}