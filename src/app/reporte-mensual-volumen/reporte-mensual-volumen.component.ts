import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DocumentoService } from '../shared/documento.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from '../shared/utils.service';
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { EstadoDocumentoEnum } from '../enum/estadodocumento.enum';
import { Documento } from 'src/model/documento.model';
import { PlazoDistribucion } from 'src/model/plazodistribucion.model';
import { PlazoDistribucionService } from '../shared/plazodistribucion.service';
import { Sede } from 'src/model/sede.model';
import { SedeDespachoService } from '../shared/sededespacho.service';
import { Envio } from 'src/model/envio.model';
import * as moment from "moment-timezone";
import { ReporteService } from '../shared/reporte.service';
import { Region } from '../../model/region.model';
import { Ambito } from '../../model/ambito.model';
import { RegionService } from '../shared/region.service';

@Component({
    selector: 'app-reporte-mensual-volumen',
    templateUrl: './reporte-mensual-volumen.component.html',
    styleUrls: ['./reporte-mensual-volumen.component.css']
})
export class ReporteMensualVolumenComponent implements OnInit {

    @ViewChild('eventText') eventText: ElementRef;
    plazo: any;

    constructor(
        public documentoService: DocumentoService,
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public proveedorService: ProveedorService,
        public sedeDespachoService: SedeDespachoService,
        private plazoDistribucionService: PlazoDistribucionService,
        public reporteService: ReporteService,
        public regionService: RegionService
    ) { }

    plazos: PlazoDistribucion[];
    envios: Envio;
    sedesDespacho: Sede[];
    proveedores: Proveedor[] = [];
    documentos: Documento[] = [];
    // reportesEficienciaPorPlazoDistribucion: any = {};
    validacion: number;
    documentosSubscription:Subscription[] = [];
    documentoForm: FormGroup;
    data: any[] = [];
    data2: any[] = [];
    data3: any[] = [];
    dataSource: any[];
    dataSource2: any[];
    dataSource3: any[];
    _postsArray: Array<any> = [];
    regiones : Region[] = [];
    private _sumagoblal: number = 0;
    regionesall : Region[] = [];
    ngOnInit() {
        this.validacion = 0;
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
            
        })

        this.proveedores = this.proveedorService.getProveedores();

        this.regionesall = this.regionService.getRegiones();

        this.sedesDespacho = this.sedeDespachoService.getSedesDespacho();

        this.proveedorService.proveedoresChanged.subscribe(
            proveedores => {
                this.proveedores = proveedores;
            }
        )

        this.regionService.regionesChanged.subscribe(
            region=>{
                this.regionesall=region;
        })

        this.sedeDespachoService.sedesDespachoChanged.subscribe(
            sedesDespacho => {
                this.sedesDespacho = sedesDespacho;
            }
        )

        this.plazos = this.plazoDistribucionService.getPlazosDistribucion();

        this.plazoDistribucionService.plazosDistribucionChanged.subscribe(
            plazos => {
                this.plazos = plazos;
            }
        )
    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {

        console.log(this.proveedores)

        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && 
            !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

                this.documentosSubscription = this.reporteService.getvolumen( fechaIni,fechaFin ).subscribe(
                (data: any) => {
                    this.validacion = 1;
                    this.data = data;
                    this.llenarDataSource(data);
                    this.llenarDataSource2(data);
                    this.llenarDatasource3(data);
                },
                error => {
                    if (error.status === 409) {
                        this.validacion = 2;
                        // this.notifier.notify('error', 'No se encontraron registros');
                    }
                    if (error.status === 417) {
                        // this.validacion = 2;
                        this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
                    }
                    if (error.status === 424) {
                        // this.validacion = 2;
                        this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
                    }
                }
            );
        }
        else {
            this.validacion = 0;
            // this.notifier.notify('error', 'Seleccione el rango de fechas de la búsqueda');
        }
     
    }


/*     llenarDataSource(data) {
        this.dataSource = [];
        this.proveedores.forEach(
            proveedor => {
                let reporteProveedor = {
                    proveedor: '',
                    cantidad: 0
                };
                reporteProveedor.proveedor = proveedor.nombre;
                Object.keys(data).forEach(key => {
                    var obj1 = data[key];
                    if (proveedor.id === parseInt(key)) {
                        Object.keys(obj1).forEach(key1 => {
                            if (key1 == "porcentaje") {
                                reporteProveedor.cantidad = obj1[key1];
                            }
                        });
                    }
                });
                this.dataSource.push(reporteProveedor);
            });  
    } */


    llenarDataSource(data) {
        this.dataSource = [];
        Object.keys(data).forEach(key1 => {

        if(1 === parseInt(key1)){
            var obj1 = data[key1];    
            this.proveedores.forEach(
                proveedor => {
                    let reporteProveedor = {
                        proveedor: '',
                        cantidad: ''
                    };
                    reporteProveedor.proveedor = proveedor.nombre;
                    Object.keys(obj1).forEach(key2 => {
                        var obj2 = obj1[key2];
                        if (proveedor.id === parseInt(key2)){
                            Object.keys(obj2).forEach(key3 => {
                                if (key3 == "porcentaje") {
                                    let numero = obj2[key3];
                                    let decimal = numero.toFixed(1);
                                    reporteProveedor.cantidad = decimal+"%";
                                }
                            });
                        }
                    });
                    this.dataSource.push(reporteProveedor);
                });  
        }    
        });
    }


    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO//2-GRAFICO
    llenarDataSource2(data2) {
        this.dataSource2 = [];
        this.sedesDespacho.forEach(
            sedeDespacho => {
                let reporteSedeDespacho = {
                    sedeDespacho: '',
                    cantidad: ''
                };
                reporteSedeDespacho.sedeDespacho = sedeDespacho.nombre;
                Object.keys(data2).forEach(key => {
                    if(2 === parseInt(key)){
                    var obj1 = data2[key];
                        Object.keys(obj1).forEach(key1 => {
                            if (sedeDespacho.id === parseInt(key1)){

                            var obj2 = obj1[key1];
                            Object.keys(obj2).forEach(key2 => {
                                if (key2 == "porcentaje") {
                                    let numero = obj2[key2];
                                    let decimal = numero.toFixed(1);
                                    reporteSedeDespacho.cantidad = decimal+'%';
                                }
                            });
                        }
                        });
                    }
                });
                this.dataSource2.push(reporteSedeDespacho);
            }
        )
    }
        // let reporteSede = {
        //     sede: 'La Molina',
        //     cantidad: 0
        // };
        // reporteSede.cantidad = documentos.length;
        // this.dataSource2.push(reporteSede);


    /*llenarDatasourcje3(documentos: Documento[]) {
        this.dataSource3 = [];
        this.proveedores.forEach(
            proveedor => {
                let graficoPorProveedor: any[] = [];
                proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(
                    plazoDistribucion => {
                        let graficoPorProveedorObjeto = {
                            plazo: plazoDistribucion.tiempoEnvio + ' H',
                            cantidad: documentos.filter(documento =>
                                documento.documentosGuia[0].guia.proveedor.id === proveedor.id &&
                                documento.envio.plazoDistribucion.id === plazoDistribucion.id).length
                        }
                        graficoPorProveedor.push(graficoPorProveedorObjeto);
                    });
                this.dataSource3[proveedor.nombre] = graficoPorProveedor;
            }
        )

    } */

/*      llenarDatasource3(data3) {

        this.dataSource3 = [];
        var a = 0;
        this.proveedores.forEach(
            proveedor => {
                let graficoPorProveedor: any[] = [];

                Object.keys(this.data3).forEach(key => {
                    var obj1 = this.data3[key];

                proveedor.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(                
                    plazoDistribucion => {
                        let graficoPorProveedorObjeto = {
                            plazo: '',
                            cantidad: 0
                        }
                        if ( proveedor.id==parseInt(key)){ 
                            graficoPorProveedorObjeto.plazo=plazoDistribucion.tiempoEnvio + ' H',

                            Object.keys(obj1).forEach(key1 => {                                
                                if (plazoDistribucion.id==parseInt(key1) ) {
                                    graficoPorProveedorObjeto.cantidad = (obj1[key1]);
                                }
                            });
                            graficoPorProveedor.push(graficoPorProveedorObjeto);
                        }
                    }
                );
                });
                this.dataSource3[proveedor.nombre] = graficoPorProveedor;
            }
        )

    } */


    llenarDatasource3(data3) {

        this.dataSource3 = [];
        var a = 0;
        this.proveedores.forEach(
            proveedor => {
                let regiones: any[] = [];


                Object.keys(data3).forEach(key => {
                    var objn = data3[key];

                    if(3 === parseInt(key)){

                    Object.keys(objn).forEach(keyx => {

                        if ( proveedor.id==parseInt(keyx)){ 

                            var obj1 = objn[keyx]; // 1 :{regiones...}

                            proveedor.ambitos.forEach(ambito=>{
                                regiones.push(ambito.region);
                            });
        
                            this.regiones=this.sinrepetir(regiones); 
                            //if ( proveedor.id==parseInt(keyx)){ 
                            this.regiones.sort((a, b) => a.id - b.id).forEach(region=>{
                                let graficoPorProveedor: any[] = [];
                                region.plazosDistribucion.sort((a, b) => a.tiempoEnvio - b.tiempoEnvio).forEach(                
                                    plazoDistribucion => {
                                        let graficoPorProveedorObjeto = {
                                            plazo: '',
                                            cantidad: 0
                                        }
                                        //if ( proveedor.id==parseInt(keyx)){ 
                
                                            Object.keys(obj1).forEach(key1 => {
        
                                                var obj2 = obj1[key1];
                                                
                                                Object.keys(obj2).forEach(key2 => {
                            
                                                    var obj3 = obj2[key2];
                                                    if (plazoDistribucion.id==parseInt(key2) && region.id==parseInt(key1)) {
                                                        graficoPorProveedorObjeto.plazo=plazoDistribucion.nombre;
                                                        graficoPorProveedorObjeto.cantidad = obj3;
                                                        graficoPorProveedor.push(graficoPorProveedorObjeto);
                                                    }
        
                                                });
        
                                            });
        
                                        //}
                                    }
        
                                );
        
                                this.dataSource3[proveedor.nombre+ '-' + region.id] = graficoPorProveedor;
        
                            });     


                        };    
                    
                        

               //}
                    
                });

                

                }

            });

            }
        )

    }

    sinrepetir(ambitos){
        let unicos = [];
        ambitos.forEach( it => {
          if (unicos.indexOf(it) == -1)
             unicos.push(it);
        })
        return unicos;
      }


    porcentajeAsignado(proveedor) {
        var a = 0;
        //this.documentoService.getPosts(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')).subscribe((data: any) => {
            Object.keys(this.data).forEach(key1 => {
            if(1 === parseInt(key1)){
    
            var obj1 = this.data[key1];    
            Object.keys(obj1).forEach(key2 => {
            if(proveedor.id===parseInt(key2)){
                var obj2 = obj1[key2];
                Object.keys(obj2).forEach(key3 => {
                    if (key3 == "cantidad") {
                        a = obj2[key3];
                    }
                });
            }
        });
        }
        });
        //});
        var numero = a;
        var final = numero;
        return final;
    }

    porcentajeAsignado2(sede) {
        var a = 0;
        //this.documentoService.getPosts(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')).subscribe((data: any) => {
            Object.keys(this.data).forEach(key => {
                if(2 === parseInt(key)){

                var obj1 = this.data[key];
                Object.keys(obj1).forEach(key1 => {
                    if(sede.id===parseInt(key1)){
                    var obj2 = obj1[key1];
                    Object.keys(obj2).forEach(key3 => {
                        if (key3 == "cantidad") {
                            a = obj2[key3];
                        }
                    });
                    }
                });

            }
        });
        //});
        var numero = a;
        var final = numero;
        return final;
    }

    regionesxproveedor(proveedor){
        let regiones: any[] = [];

        proveedor.ambitos.sort((a, b) => a.region.id - b.region.id).forEach(ambito=>{
            regiones.push(ambito.region);
        });
        regiones=this.sinrepetir(regiones);
        return regiones;
    }


    sumaporproveedor(){
        var a = 0;
        Object.keys(this.data).forEach(key => {
                var obj1 = this.data[key];
                if(1 === parseInt(key)){
                Object.keys(obj1).forEach(key1 => {
                    var obj2 = obj1 [key1];
                    Object.keys(obj2).forEach(key2 => {
                        if (key2 == "cantidad") {
                            a = a +obj2[key2];
                        }
                    });
                });
            }
            });
        var numero = a;
        var final = numero;
        return final;
    }

/*     sumaporsede(){
        var a = 0;
        Object.keys(this.data2).forEach(key => {
            var obj1 = this.data2[key];
            Object.keys(obj1).forEach(key1 => {
                if (key1 == "cantidad") {
                    a = a + obj1[key1];
                }
            });
        });
        var numero = a;
        var final = numero;
        return final;
    } */

    sumaporsede(){
        var a = 0;
        Object.keys(this.data).forEach(key => {
            if(2 === parseInt(key)){
                var obj1 = this.data[key];
                Object.keys(obj1).forEach(key1 => {
                    var obj2 = obj1[key1];
                    Object.keys(obj2).forEach(key2 => {
                        if (key2 == "cantidad") {
                            a = a +obj2[key2];
                        }
                    });
                });
            }
            });
        var numero = a;
        var final = numero;
        return final;
    }

    ngOnDestroy() {
        this.documentosSubscription.forEach(s => s.unsubscribe());
    }

    //----------------------------------------------------------------------------------------------------------------------------------

    legendLayout: any = { left: 700, top: 160, width: 300, height: 200, flow: 'vertical' };
    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 0, top: 0, right: 0, bottom: 10 };

    getWidth(): any {
        if (document.body.offsetWidth < 8550) {
            return '60%';
        }
        return 850;
    }

    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR COURIER --------------------------------------------------------------------------------------

    paddingC: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePaddingC: any = { left: 0, top: 0, right: 0, bottom: 10 };

    seriesGroupsPro: any[] =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'proveedor',
                            labelRadius: 170,
                            initialAngle: 90,
                            radius: 145,
                            centerOffset: 2,
                            formatFunction: (value: any) => {
                                if (isNaN(value))
                                    return value;
                                //return parseFloat(value);
                                return parseFloat(value) + '%';
                            },
                        }
                    ]
            }
        ];

    // VOLUMEN DE DISTRIBUCIÓN - PIE - POR UTD ------------------------------------------------------------------------------------------

    paddingU: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePaddingU: any = { left: 0, top: 0, right: 0, bottom: 10 };

    seriesGroupsUtd: any[] =
        [
            {
                type: 'pie',
                showLabels: true,
                series:
                    [
                        {
                            dataField: 'cantidad',
                            displayText: 'sedeDespacho',
                            labelRadius: 170, //acercar o alejar el numero del centro del pie
                            initialAngle: 90,
                            radius: 145, //tamaño del radio
                            centerOffset: 2, //separacion entre secciones del pie
                            // formatSettings: { sufix: '%', decimalPlaces: 1 } //formato de porcentaje
                            formatFunction: (value: any) => {
                                if (isNaN(value))
                                    return value;
                                //return parseFloat(value);
                                return parseFloat(value) + '%';
                            }

                        }
                    ]
            }
        ]

    // VOLUMEN DE DISTRIBUCIÓN - BAR -  -----------------------------------------------------------------------------

    paddingS: any = { left: 20, top: 20, right: 20, bottom: 5 };
    titlePaddingS: any = { left: 90, top: 0, right: 0, bottom: 10 };

    getAxis(dataField: string) {
        return {

            dataField: dataField,
            unitInterval: 1,
            axisSize: 'auto',
            textRotationAngle: 90,
            tickMarks: {
                visible: true,
                interval: 1,
                color: '#CACACA'
            },
            gridLines: {
                visible: true, //mostrar linea vertical 
                interval: 1, //cada "N" espacios
                color: '#BCBCBC'
            }
        }
    }

    getValueAxis(title: string, flip = false) {
        return {
            visible: false,
            flip: flip,
            title: { text: title },
            tickMarks: { color: '#BCBCBC' },
            labels: { horizontalAlignment: 'left' },
            minValue: 0,
            unitInterval: 2
        }
    }

    getSeriesGroups(type: string, datas: any[], orientation = 'vertical') {
        let series: any[] = [];
        datas.forEach(data => {
            let keys: string[] = Object.keys(data);
            if (keys.length == 1) {
                series.push({
                    dataField: keys[0],
                    displayText: data[keys[0]],
                    showLabels: true
                })
            } else {
                series.push({
                    dataField: keys[0],
                    displayText: data[keys[0]],
                    colorFunction: (value, itemIndex) => {
                        if (data['indiceReporte'] < itemIndex) {
                            return '#fff655';
                        }
                        return '#55CC55';
                    },
                    showLabels: true
                })
            }
        });


        return [
            {
                type: type,
                orientation: orientation,
                series: series,
                columnsMinWidth: 20,
                columnsMaxWidth: 10000,
            }
        ]
    }



}
