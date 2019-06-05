export class AppSettings {
    
    /* URL */ 
    
    public static API_ENDPOINT = "http://localhost:8092/";
    public static BUZON_URL = "buzones/";
    public static EMPLEADO_URL = "empleados/";
    public static PLAZO_DISTRIBUCION_URL = "plazosdistribucion/";
    public static SEDE_DESPACHO_URL = "sedes";
    public static TIPO_SERVICIO_URL = "tiposservicio/";
    public static PRODUCTO_URL = "productos/";
    public static REGION_URL = "regiones/";
    public static FERIADO_URL = "feriados/";
    public static CLASIFICACION = "tiposdocumento/";
    public static TIPO_SEGURIDAD_URL = "tiposseguridad/";
    public static TIPO_PERIODO_URL = "periodos/";
    public static TIPO_DEVOLUCION_URL = "tipodevolucion/";
    public static PAIS_URL = "paises/";
    public static DEPARTAMENTO_URL = "departamentos/";
    public static PROVINCIA_URL = "provincias/";
    public static DISTRITO_URL = "distritos/";
    public static DOCUMENTO_URL = "documentos/";
    public static AREA_URL = "areas/";
    public static ENVIO_URL = "envios/";
    public static ENVIO_MASIVO_URL = "enviosmasivos/";
    public static PROVEEDOR_URL = "proveedores/";
    public static TIPOPLAZODISTRIBUCION_URL = "tiposplazo/";
    public static GUIA_URL = "guias/";
    public static DOCUMENTO_GUIA_URL = "documentosguia/";
    public static ESTADO_DOCUMENTO_URL = "estadosdocumento/";
    public static MOTIVO_ESTADO_DOCUMENTO_URL = "motivosestados/";
    public static TIPO_ESTADO_DOCUMENTO_URL = "tiposestadodocumento/";
    public static MENU_URL = "menus/";
    public static REPORTE_URL="reportes/"

    /** ARCHIVOS */

    public static PLANTILLA_MASIVO = "http://localhost:8080/externa-static/archivos/plantilla-excel-masivo.xlsx";
    public static PLANTILLA_RESULTADOS = "http://localhost:8080/externa-static/archivos/plantilla-excel-resultados.xlsx";
    public static PLANTILLA_DEVUELTOS = "http://localhost:8080/externa-static/archivos/plantilla-excel-devueltos.xlsx";
    public static MANUAL_REGISTRO = "http://localhost:8080/externa-static/archivos/registro.pdf";

    /** IMAGENES */

    public static logoImagePath = '/assets/images/logo-externus.png'

    /** TABLES */

    public static tableSettings = {
        editable: false, 
        columns: {},
        actions: {
            add: false,
            edit: false,
            delete: false,
          }, 
        hideSubHeader: true,
        attr: {
            class: 'table table-bordered'
          }
    }

}