export class AppSettings {
    
    /* URL */ 
    
    public static API_ENDPOINT = "http://localhost:8092/";
    public static BUZON_URL = "buzones/";
    public static EMPLEADO_URL = "empleados/";
    public static PLAZO_DISTRIBUCION_URL = "plazosdistribucion/";
    public static TIPO_SERVICIO_URL = "tiposservicio/";
    public static TIPO_SEGURIDAD_URL = "tiposseguridad/";
    public static TIPO_DOCUMENTO_URL = "tiposdocumento/";
    public static PAIS_URL = "paises/";
    public static DEPARTAMENTO_URL = "departamentos/";
    public static PROVINCIA_URL = "provincias/";
    public static DISTRITO_URL = "distritos/";
    public static DOCUMENTO_URL = "documentos/";
    public static AREA_URL = "areas/";
    public static ENVIO_URL = "envios/";
    public static ENVIO_MASIVO_URL = "enviosmasivos/";
    public static PROVEEDOR_URL = "proveedores/";
    public static GUIA_URL = "guias/";
    public static DOCUMENTO_GUIA_URL = "documentosguia/";

    /** ARCHIVOS */

    public static PANTILLA_MASIVO = "http://localhost:8080/externa-static/archivos/plantilla-excel-masivo.xlsx";
    public static MANUAL_REGISTRO = "http://localhost:8080/externa-static/archivos/registro.pdf";

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