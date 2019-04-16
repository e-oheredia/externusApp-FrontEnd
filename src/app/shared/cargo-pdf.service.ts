import { EnvioMasivo } from './../../model/enviomasivo.model';
import { Envio } from './../../model/envio.model';
import { Injectable } from "@angular/core";
import * as jsPDF from "jspdf";
import { UtilsService } from "./utils.service";
import { EnvioBloque } from 'src/model/enviobloque.model';


@Injectable()
export class CargoPdfService {


    constructor(
        private utilsService: UtilsService
    ) { 

    }

    doc = new jsPDF();
    PAGE_WIDTH = this.doc.internal.pageSize.getWidth();
    PAGE_HEIGHT = this.doc.internal.pageSize.getHeight();
    CODIGO_BARRAS_WIDTH = 150


    generarPdfIndividual(envio: Envio, codigoBarrasSvg: any) {
        let doc = new jsPDF();  
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarrasSvg);
        var svgSize = codigoBarrasSvg.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            doc.text(40, 20, 'EXTERNUS - ENVÍO INDIVIDUAL');
            doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            doc.setFontSize(12);
            let info = {
                'DE:': envio.buzon.nombre, 
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PARA:': envio.documentos[0].razonSocialDestino + ' - ' +  envio.documentos[0].contactoDestino, 
                'DIRECCION:': envio.documentos[0].direccion + ', ' +  envio.documentos[0].distrito.nombre + ', ' +  envio.documentos[0].distrito.provincia.nombre + ', ' + envio.documentos[0].distrito.provincia.departamento.nombre, 
                'PLAZO DISTRIBUCIÓN:': envio.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': envio.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': envio.tipoServicio.nombre
            }
            this.escribirInformacionPdf(doc, info, 160);

            doc.save(envio.documentos[0].documentoAutogenerado + '.pdf');      
            canvas = null;
        }
        image.src = codigoBarrasBase64;
    }

    generarPdfMasivo(envio: EnvioMasivo, codigoBarrasSvg: any) {
        let doc = new jsPDF(); 
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarrasSvg);
        var svgSize = codigoBarrasSvg.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            doc.text(40, 20, 'EXTERNUS - ENVÍO MASIVO');
            doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            doc.setFontSize(12);
            let info = {
                'DE:': envio.buzon.nombre, 
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PLAZO DISTRIBUCIÓN:': envio.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': envio.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': envio.tipoServicio.nombre
            }
            this.escribirInformacionPdf(doc, info, 160);

            doc.save(envio.masivoAutogenerado + '.pdf');       
            canvas = null;
        }
        image.src = codigoBarrasBase64;
    }

    generarPdfBloque(envio: EnvioBloque, codigoBarrasSvg: any) {
        let doc = new jsPDF(); 
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarrasSvg);
        var svgSize = codigoBarrasSvg.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            doc.text(40, 20, 'EXTERNUS - ENVÍO MASIVO');
            doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            doc.setFontSize(12);
            let info = {
                'DE:': envio.buzon.nombre, 
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PLAZO DISTRIBUCIÓN:': envio.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': envio.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': envio.tipoServicio.nombre
            }
            this.escribirInformacionPdf(doc, info, 160);

            doc.save(envio.autogenerado + '.pdf');       
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

    generarPDFsEtiqueta(codigosBarra: any[]) {
        let doc = new jsPDF();
        this.generarPDFsEtiquetaConjsPDF(doc, codigosBarra);
    }

    generarPDFsCargo(codigosBarra: any[], documentosACustodiar: any[]) {
        let doc = new jsPDF();
        this.generarPDFsCargoConjsPDF(doc, codigosBarra, documentosACustodiar);
    }

    generarPDFsEtiquetaConjsPDF(doc, codigosBarra: any[]) {
        let codigoBarra = codigosBarra.pop();
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarra);
        var svgSize = codigoBarra.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            var imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 2, -43, 59,  59 * image.height / image.width, undefined, undefined, - 90);
            canvas = null;
            if (codigosBarra.length > 0) {
                doc.addPage();   
                this.generarPDFsEtiquetaConjsPDF(doc, codigosBarra);
            }else{
                doc.save('CUSTODIA-ETIQUETA.PDF');
            }            
        }
        image.src = codigoBarrasBase64;        
    }

    generarPDFsCargoConjsPDF(doc, codigosBarra, documentosACustodiar) {
        let codigoBarra = codigosBarra.pop();
        let documentoACustodiar = documentosACustodiar.pop();
        let codigoBarrasBase64 = this.utilsService.svgToBase64(codigoBarra);
        var svgSize = codigoBarra.viewBox.baseVal;
        var image = new Image();
        image.onload = () => {            
            var canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            var context = canvas.getContext('2d');            
            context.drawImage(image, 0, 0);
            doc.setFontSize(25);
            var imgData = canvas.toDataURL('image/png');
            doc.text(40, 20, 'EXTERNUS - ENVÍO INDIVIDUAL');
            doc.addImage(imgData, 'PNG', (this.PAGE_WIDTH - this.CODIGO_BARRAS_WIDTH) / 2, 40, this.CODIGO_BARRAS_WIDTH, this.CODIGO_BARRAS_WIDTH * image.height / image.width);
            doc.setFontSize(12);
            let info = {
                'DE:': documentoACustodiar.envioInfo.buzon.nombre,
                'SEDE ORIGEN: ': 'LA MOLINA',
                'PARA:': documentoACustodiar.envioInfo.documentos[0].razonSocialDestino + ' - ' +  documentoACustodiar.envioInfo.documentos[0].contactoDestino, 
                'DIRECCION:': documentoACustodiar.envioInfo.documentos[0].direccion + ', ' +  documentoACustodiar.envioInfo.documentos[0].distrito.nombre + ', ' +  documentoACustodiar.envioInfo.documentos[0].distrito.provincia.nombre + ', ' + documentoACustodiar.envioInfo.documentos[0].distrito.provincia.departamento.nombre, 
                'PLAZO DISTRIBUCIÓN:': documentoACustodiar.envioInfo.plazoDistribucion.nombre, 
                'TIPO DE SEGURIDAD:': documentoACustodiar.envioInfo.tipoSeguridad.nombre, 
                'TIPO DE SERVICIO:': documentoACustodiar.envioInfo.tipoServicio.nombre
            }
            this.escribirInformacionPdf(doc, info, 160);            
            canvas = null;
            if (codigosBarra.length > 0) {
                doc.addPage();   
                this.generarPDFsCargoConjsPDF(doc, codigosBarra, documentosACustodiar);
            }else{
                doc.save('CUSTODIA-CARGO.PDF');
            }
        }
        image.src = codigoBarrasBase64;
    }











}