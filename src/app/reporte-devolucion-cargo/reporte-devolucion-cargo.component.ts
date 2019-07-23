import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../shared/utils.service';
import { NotifierService } from 'angular-notifier';
import * as moment from "moment-timezone";
import { Proveedor } from 'src/model/proveedor.model';
import { ProveedorService } from '../shared/proveedor.service';
import { DocumentoService } from '../shared/documento.service';
import { AreaService } from '../shared/area.service';
import { Area } from 'src/model/area.model';
import { ReporteService } from '../shared/reporte.service';
import { TipoDevolucion } from 'src/model/tipodevolucion.model';
import { TipoDevolucionService } from '../shared/tipodevolucion.service';

@Component({
    selector: 'app-reporte-devolucion-cargo',
    templateUrl: './reporte-devolucion-cargo.component.html',
    styleUrls: ['./reporte-devolucion-cargo.component.css']
})
export class ReporteDevolucionCargoComponent implements OnInit {

    documentoForm: FormGroup;
    documentosSubscription: Subscription;
    areasSubscription: Subscription;
    proveedores: Proveedor[];
    tiposDevolucion: TipoDevolucion[];
    areas: Area[];
    dataGraficoDevolucionCargos = [];
    dataGraficoDevolucionDocumentos = [];
    dataGraficoDevolucionDenuncias = [];
    dataGraficoDetallePendienteArea = [];
    dataGraficoDetallePendienteAreaTop = [];
    dataTablaCargo = [];
    dataTablaDocumento = [];
    dataTablaDenuncia = [];
    dataTablaCargoArray = [];
    dataTablaDocumentoArray = [];
    dataTablaDenunciaArray = [];
    tablaProveedores = [];
    pendientesDocu = [];
    validacion: number;
    data: any[] = [];
    dataGrafico1: any[] = [];
    dataGrafico2: any[] = [];
    data2: any[] = [];

    constructor(
        public notifier: NotifierService,
        public utilsService: UtilsService,
        public documentoService: DocumentoService,
        public proveedorService: ProveedorService,
        public areaService: AreaService,
        private reporteService: ReporteService,
        private tipodDevolucionService: TipoDevolucionService
    ) { }

    ngOnInit() {
        this.validacion = 0;
        this.documentoForm = new FormGroup({
            "fechaIni": new FormControl(null, Validators.required),
            "fechaFin": new FormControl(null, Validators.required)
        })
        this.proveedores = this.proveedorService.getProveedores();
        this.tiposDevolucion = this.tipodDevolucionService.getTiposDevolucion();
        this.proveedorService.proveedoresChanged.subscribe(
            proveedores => {
                this.proveedores = proveedores;
            }
        )
        this.tipodDevolucionService.tiposDevolucionChanged.subscribe(
            tiposDevolucion => {
                this.tiposDevolucion = tiposDevolucion;
            }
        )
        this.areasSubscription = this.areaService.listarAreasAll().subscribe(
            areas => {
                this.areas = areas;
            }
        )

    }

    Porcentaje(cantidad: number, total: number): string {
        let resultado = (cantidad * 100) / total;
        if (isNaN(resultado)) {
            resultado = 0;
        }
        var final = resultado.toFixed(1) + '%';
        return final;
    }

    MostrarReportes(fechaIni: Date, fechaFin: Date) {
        if (!this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaIni'].value) && !this.utilsService.isUndefinedOrNullOrEmpty(this.documentoForm.controls['fechaFin'].value)) {

            let fechaIniDate = new Date(fechaIni);
            let fechaFinDate = new Date(fechaFin);
            fechaIniDate = new Date(fechaIniDate.getTimezoneOffset() * 60 * 1000 + fechaIniDate.getTime());
            fechaFinDate = new Date(fechaFinDate.getTimezoneOffset() * 60 * 1000 + fechaFinDate.getTime());

            this.documentosSubscription = this.reporteService.cantidadDevolucionPorTipoDevolucion(moment(new Date(fechaIniDate.getFullYear(), fechaIniDate.getMonth(), 1)).format('YYYY-MM-DD'), moment(new Date(fechaFinDate.getFullYear(), fechaFinDate.getMonth() + 1, 0)).format('YYYY-MM-DD')).subscribe(
                (data: any) => {
                    this.validacion = 1;
                    this.data = data;
                    Object.keys(data).forEach(key => {
                        var obj = data[key];
                        if (parseInt(key) == 1) {
                            this.dataGrafico1 = obj
                        } else {
                            this.dataGrafico2 = obj
                        }
                    })
                    this.GraficoDevolucionCargos(this.dataGrafico1);
                    this.GraficoDevolucionDocumentos(this.dataGrafico1);
                    this.GraficoDevolucionDenuncias(this.dataGrafico1);
                    this.GraficoPorArea(this.dataGrafico2);
                },
                error => {
                    if (error.status === 409) {
                        this.validacion = 2
                    }
                    if (error.status === 417) {
                        this.notifier.notify('error', 'Seleccionar un rango de fechas correcto');
                    }
                    if (error.status === 424) {
                        this.notifier.notify('error', 'Seleccione como máximo un periodo de 13 meses');
                    }
                }
            );
        }
        else {
            this.validacion = 0;
        }
    }

    generalTipoDevolucion(data) {
        let cantdevuelto = 0;
        let cantpendiente = 0;
        let valortotal = 0;

        this.proveedores.forEach(
            proveedores => {
                let eficienciaPorProveedorObjeto = {
                    proveedor: "",
                    dentroPlazo: 0,
                    fueraPlazo: 0
                };
                let tipocantidad = {
                    tipo: 0,
                    devuelto: 0,
                    pendiente: 0
                };
                eficienciaPorProveedorObjeto.proveedor = proveedores.nombre;
                Object.keys(data).forEach(key => {
                    var obj = data[key];
                    if (proveedores.id == parseInt(key)) {
                        Object.keys(obj).forEach(key1 => {
                            tipocantidad.tipo = parseInt(key);
                            var cantTipo = obj[key1];
                            Object.keys(cantTipo).forEach(key2 => {
                                if (key2 == "devuelto") {
                                    tipocantidad.devuelto = cantTipo[key2]
                                    cantdevuelto += cantTipo[key2]
                                } else {
                                    tipocantidad.pendiente = cantTipo[key2]
                                }
                            });
                        });
                    }
                });
                valortotal = cantdevuelto + cantpendiente;
                let porcentajedentroplazo = (cantdevuelto / valortotal) * 100;
                let porcentajefueraplazo = (cantpendiente / valortotal) * 100;
                eficienciaPorProveedorObjeto.dentroPlazo = porcentajedentroplazo;
                eficienciaPorProveedorObjeto.fueraPlazo = porcentajefueraplazo;
            });
    }

    GraficoDevolucionCargos(data) {
        this.dataGraficoDevolucionCargos = [];
        this.dataTablaCargo = [];
        this.dataTablaCargoArray = [];
        this.tablaProveedores = [];
        let jj: number = 1;
        let cantdevueltos = 0;
        let cantpendientes = 0;
        let rTablaPendienteCar = {
            estado: '',
            general: '',
        }
        let rTablaDevueltoCar = {
            estado: '',
            general: '',
        }
        this.proveedores.forEach(
            proveedor => {
                let total = 0;
                let cargos = {
                    Courier: "",
                    PendientePorcentaje: "",
                    DevueltoPorcentaje: ""
                }
                let listaProveedor = {
                    id: 0,
                    nombre: ""
                };

                if (jj === 1) {
                    listaProveedor.id = jj;
                    listaProveedor.nombre = 'GENERAL';
                }
                listaProveedor.id = jj;
                listaProveedor.nombre = proveedor.nombre;
                this.tablaProveedores.push(listaProveedor);
                jj++;
                Object.keys(data).forEach(key => {
                    if (proveedor.id == parseInt(key)) {
                        var obj = data[key];
                        cargos.Courier = proveedor.nombre
                        Object.keys(obj).forEach(key1 => {
                            if (parseInt(key1) == 1) {
                                var cantTipo = obj[key1];
                                for (var el in cantTipo) {
                                    if (cantTipo.hasOwnProperty(el)) {
                                        total += parseInt(cantTipo[el]);
                                    }
                                }
                                Object.keys(cantTipo).forEach(key2 => {
                                    if (key2 == "devuelto") {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.DevueltoPorcentaje = resultado.toFixed(1) + '%';
                                        cantdevueltos += cantTipo[key2]
                                    } else {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.PendientePorcentaje = resultado.toFixed(1) + '%';
                                        cantpendientes += cantTipo[key2]
                                    }
                                });
                            }
                        });
                        this.dataGraficoDevolucionCargos.push(cargos);
                    }
                });
            }
        );

        let cargosGeneral = {
            Courier: "",
            Devuelto: 0,
            Pendiente: 0,
            DevueltoPorcentaje: "",
            PendientePorcentaje: ""
        }
        cargosGeneral.Courier = 'GENERAL'
        cargosGeneral.Devuelto = cantdevueltos
        cargosGeneral.Pendiente = cantpendientes
        let totalGeneral = cantdevueltos + cantpendientes
        let resultadodevueltos = (cantdevueltos * 100) / totalGeneral;
        if (isNaN(resultadodevueltos)) {
            resultadodevueltos = 0;
        }
        cargosGeneral.DevueltoPorcentaje = resultadodevueltos.toFixed(1) + '%';
        let resultadopendientes = (cantpendientes * 100) / totalGeneral;
        if (isNaN(resultadopendientes)) {
            resultadopendientes = 0;
        }
        cargosGeneral.PendientePorcentaje = resultadopendientes.toFixed(1) + '%';
        this.dataGraficoDevolucionCargos.push(cargosGeneral);

        rTablaPendienteCar.estado = 'PENDIENTE';
        rTablaPendienteCar.general = this.Porcentaje(cargosGeneral.Pendiente, cargosGeneral.Pendiente + cargosGeneral.Devuelto);

        rTablaDevueltoCar.estado = 'DEVUELTO';
        rTablaDevueltoCar.general = this.Porcentaje(cargosGeneral.Devuelto, cargosGeneral.Pendiente + cargosGeneral.Devuelto);


        this.dataTablaCargo.push(rTablaPendienteCar);
        this.dataTablaCargo.push(rTablaDevueltoCar);
    }

    cargospendientes(proveedor) {
        var cantidadpendiente = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("1")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "pendiente") {
                                cantidadpendiente = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidadpendiente;
    }

    cargosdevueltos(proveedor) {
        var cantidaddevuelto = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("1")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "devuelto") {
                                cantidaddevuelto = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidaddevuelto;
    }

    totalcargospendientes() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("1")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "pendiente") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }

    totalcargosdevueltos() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("1")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "devuelto") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }

















    GraficoDevolucionDocumentos(data) {
        this.dataGraficoDevolucionDocumentos = [];
        let cantdevueltos = 0;
        let cantpendientes = 0;
        this.dataTablaDocumento = [];
        this.dataTablaDocumentoArray = [];
        let rTablaPendienteDoc = {
            estado: '',
            general: '',
        }

        let rTablaDevueltoDoc = {
            estado: '',
            general: '',
        }
        this.proveedores.forEach(
            proveedor => {
                let total = 0;
                let cargos = {
                    Courier: "",
                    PendientePorcentaje: "",
                    DevueltoPorcentaje: ""
                }
                Object.keys(data).forEach(key => {
                    if (proveedor.id == parseInt(key)) {
                        var obj = data[key];
                        cargos.Courier = proveedor.nombre
                        Object.keys(obj).forEach(key1 => {
                            if (parseInt(key1) == 2) {
                                var cantTipo = obj[key1];
                                for (var el in cantTipo) {
                                    if (cantTipo.hasOwnProperty(el)) {
                                        total += parseInt(cantTipo[el]);
                                    }
                                }
                                Object.keys(cantTipo).forEach(key2 => {
                                    if (key2 == "devuelto") {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.DevueltoPorcentaje = resultado.toFixed(1) + '%';
                                        cantdevueltos += cantTipo[key2]
                                    } else {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.PendientePorcentaje = resultado.toFixed(1) + '%';
                                        cantpendientes += cantTipo[key2]
                                    }
                                });
                            }
                        });
                        this.dataGraficoDevolucionDocumentos.push(cargos);
                    }
                });
            }
        );
        let documentosGeneral = {
            Courier: "",
            Devuelto: 0,
            Pendiente: 0,
            DevueltoPorcentaje: "",
            PendientePorcentaje: ""
        }
        documentosGeneral.Courier = 'GENERAL'
        documentosGeneral.Devuelto = cantdevueltos
        documentosGeneral.Pendiente = cantpendientes
        let totalGeneral = cantdevueltos + cantpendientes
        let resultadodevueltos = (cantdevueltos * 100) / totalGeneral;
        if (isNaN(resultadodevueltos)) {
            resultadodevueltos = 0;
        }
        documentosGeneral.DevueltoPorcentaje = resultadodevueltos.toFixed(1) + '%';
        let resultadopendientes = (cantpendientes * 100) / totalGeneral;
        if (isNaN(resultadopendientes)) {
            resultadopendientes = 0;
        }
        documentosGeneral.PendientePorcentaje = resultadopendientes.toFixed(1) + '%';
        this.dataGraficoDevolucionDocumentos.push(documentosGeneral);
        rTablaPendienteDoc.estado = 'PENDIENTE';
        rTablaPendienteDoc.general = this.Porcentaje(documentosGeneral.Pendiente, documentosGeneral.Pendiente + documentosGeneral.Devuelto);

        rTablaDevueltoDoc.estado = 'DEVUELTO';
        rTablaDevueltoDoc.general = this.Porcentaje(documentosGeneral.Devuelto, documentosGeneral.Pendiente + documentosGeneral.Devuelto);


        this.dataTablaDocumento.push(rTablaPendienteDoc);
        this.dataTablaDocumento.push(rTablaDevueltoDoc);


        this.dataTablaDocumentoArray = this.dataTablaDocumento.map(function (obj) {
            return [obj.estado, obj.general];
        });
    }

    rezagospendientes(proveedor) {
        var cantidadpendiente = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("2")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "pendiente") {
                                cantidadpendiente = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidadpendiente;
    }

    rezagosdevueltos(proveedor) {
        var cantidaddevuelto = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("2")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "devuelto") {
                                cantidaddevuelto = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidaddevuelto;
    }

    totalrezagospendientes() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("2")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "pendiente") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }

    totalrezagosdevueltos() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("2")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "devuelto") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }

















    GraficoDevolucionDenuncias(data) {
        this.dataGraficoDevolucionDenuncias = [];
        let cantdevueltos = 0;
        let cantpendientes = 0;
        this.dataTablaDenuncia = []
        this.dataTablaDenunciaArray = []
        let rTablaPendienteDenu = {
            estado: '',
            general: ''
        }
        let rTablaDevueltoDenu = {
            estado: '',
            general: ''
        }
        this.proveedores.forEach(
            proveedor => {
                let total = 0;
                let cargos = {
                    Courier: "",
                    PendientePorcentaje: "",
                    DevueltoPorcentaje: ""
                }
                Object.keys(data).forEach(key => {
                    if (proveedor.id == parseInt(key)) {
                        var obj = data[key];
                        cargos.Courier = proveedor.nombre
                        Object.keys(obj).forEach(key1 => {
                            if (parseInt(key1) == 3) {
                                var cantTipo = obj[key1];
                                for (var el in cantTipo) {
                                    if (cantTipo.hasOwnProperty(el)) {
                                        total += parseInt(cantTipo[el]);
                                    }
                                }
                                Object.keys(cantTipo).forEach(key2 => {
                                    if (key2 == "devuelto") {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.DevueltoPorcentaje = resultado.toFixed(1) + '%';
                                        cantdevueltos += cantTipo[key2]
                                    } else {
                                        let resultado = (cantTipo[key2] * 100) / total;
                                        if (isNaN(resultado)) {
                                            resultado = 0;
                                        }
                                        cargos.PendientePorcentaje = resultado.toFixed(1) + '%';
                                        cantpendientes += cantTipo[key2]
                                    }
                                });
                            }
                        });
                        this.dataGraficoDevolucionDenuncias.push(cargos);
                    }
                });
            }
        );
        let denunciasGeneral = {
            Courier: "",
            Devuelto: 0,
            Pendiente: 0,
            DevueltoPorcentaje: "",
            PendientePorcentaje: ""
        }
        denunciasGeneral.Courier = 'GENERAL'
        denunciasGeneral.Devuelto = cantdevueltos
        denunciasGeneral.Pendiente = cantpendientes
        let totalGeneral = cantdevueltos + cantpendientes
        let resultadodevueltos = (cantdevueltos * 100) / totalGeneral;
        if (isNaN(resultadodevueltos)) {
            resultadodevueltos = 0;
        }
        denunciasGeneral.DevueltoPorcentaje = resultadodevueltos.toFixed(1) + '%';
        let resultadopendientes = (cantpendientes * 100) / totalGeneral;
        if (isNaN(resultadopendientes)) {
            resultadopendientes = 0;
        }
        denunciasGeneral.PendientePorcentaje = resultadopendientes.toFixed(1) + '%';
        this.dataGraficoDevolucionDenuncias.push(denunciasGeneral);

        rTablaPendienteDenu.estado = 'PENDIENTE';
        rTablaPendienteDenu.general = this.Porcentaje(denunciasGeneral.Pendiente, denunciasGeneral.Pendiente + denunciasGeneral.Devuelto);

        rTablaDevueltoDenu.estado = 'DEVUELTO';
        rTablaDevueltoDenu.general = this.Porcentaje(denunciasGeneral.Devuelto, denunciasGeneral.Pendiente + denunciasGeneral.Devuelto);


        this.dataTablaDenuncia.push(rTablaPendienteDenu);
        this.dataTablaDenuncia.push(rTablaDevueltoDenu);


        this.dataTablaDenunciaArray = this.dataTablaDenuncia.map(function (obj) {
            return [obj.estado, obj.general];
        });


    }

    denunciaspendientes(proveedor) {
        var cantidadpendiente = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("3")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "pendiente") {
                                cantidadpendiente = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidadpendiente;
    }

    denunciasdevueltas(proveedor) {
        var cantidaddevuelto = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key1 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key1));
                    if (devolucion.id === parseInt("3")) {
                        var obj2 = obj1[key1];
                        Object.keys(obj2).forEach(key2 => {
                            if (key2 === "devuelto") {
                                cantidaddevuelto = obj2[key2]
                            }
                        })
                    }
                })
            }
        })
        return cantidaddevuelto;
    }

    totaldenunciaspendientes() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("3")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "pendiente") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }

    totaldenunciasdevueltas() {
        var total = 0
        Object.keys(this.dataGrafico1).forEach(key => {
            let proveedor = this.proveedores.find(proveedor => proveedor.id === parseInt(key));
            if (proveedor.id === parseInt(key)) {
                var obj1 = this.dataGrafico1[key];
                Object.keys(obj1).forEach(key2 => {
                    let devolucion = this.tiposDevolucion.find(devolucion => devolucion.id === parseInt(key2));
                    if (devolucion.id === parseInt("3")) {
                        var obj2 = obj1[key2];
                        Object.keys(obj2).forEach(key3 => {
                            if (key3 === "devuelto") {
                                total += obj2[key3]
                            }
                        })
                    }
                })
            }
        })
        return total;
    }




















    GraficoPorArea(data) {
        let ii = 1;
        this.dataGraficoDetallePendienteAreaTop = [];
        this.areas.forEach(

            area => {
                let r_area = {
                    area: '',
                    cantidad: '',
                }
                Object.keys(data).forEach(key => {
                    if (area.id == parseInt(key)) {
                        r_area.area = area.nombre;
                        r_area.cantidad = data[key];
                        this.dataGraficoDetallePendienteArea.push(r_area);
                    }
                });
            }
        );
        this.dataGraficoDetallePendienteArea.sort((a, b) => (a.cantidad > b.cantidad) ? 1 : ((b.cantidad > a.cantidad) ? -1 : 0)).reverse();
        let i = 1;
        let cantidad_otras_areas: number = 0;
        let otras_areas = {
            area: '',
            cantidad: '',
        }
        this.dataGraficoDetallePendienteArea.forEach(
            registro => {
                if (i <= 6) {
                    this.dataGraficoDetallePendienteAreaTop.push(registro);
                    i++;
                }
                else {
                    cantidad_otras_areas += parseInt(registro.cantidad);
                }
            }
        )

        otras_areas.area = "OTROS";
        otras_areas.cantidad = cantidad_otras_areas.toString();

        this.dataGraficoDetallePendienteAreaTop.push(otras_areas);
    }






    //**************************************************************************************************************************************** */
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }
        return '80%';
    }

    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

    xAxis: any =
        {
            dataField: 'Courier',
            showGridLines: true
        };
    seriesGroups: any[] =
        [
            {
                type: 'stackedcolumn',
                columnsGapPercent: 85,
                seriesGapPercent: 0,
                valueAxis:
                {
                    maxValue: 'auto',
                    minValue: 0,
                    displayValueAxis: true,
                    description: 'Cantidad de cargos',
                    axisSize: 'auto',
                    tickMarksColor: '#FFFFFF'
                },
                series: [
                    { dataField: 'DevueltoPorcentaje', displayText: 'Devuelto', showLabels: true, },
                    { dataField: 'PendientePorcentaje', displayText: 'Pendiente', showLabels: true, }
                ]
            }
        ];



    //********************************************************************************************************************* */


    xAxis2: any =
        {
            dataField: 'area',
            labels:
            {
                angle: 90,
                horizontalAlignment: 'right',
                verticalAlignment: 'center',
                rotationPoint: 'right',
                offset: { x: 0, y: -5 }
            }
        };

    valueAxis2: any =
        {
            minValue: 0,
            flip: true,
            labels: {
                visible: false
            },
            // axisSize: 'auto',
            maxValue: 'auto',
            unitInterval: 5,
        };
    seriesGroups2: any[] =
        [
            {
                type: 'column',
                orientation: 'horizontal',
                columnsMaxWidth: 30,
                toolTipFormatSettings: { thousandsSeparator: ',' },
                series: [
                    { dataField: 'cantidad', displayText: 'cantidad', showLabels: true, }
                ]
            }
        ];





}
