import { Injectable } from "@angular/core";
import * as moment from 'moment-timezone';


@Injectable()
export class UtilsService {

    constructor() { }

    public isEmpty(data): boolean {
        if ((data instanceof Array && data.length == 0) || (data instanceof String && data.trim().length === 0) || (data === '')) {
            return true;
        }
        return false;
    }

    public isUndefinedOrNull(data): boolean {
        return data === undefined || data === null;
    }

    public isUndefinedOrNullOrEmpty(data): boolean {
        return this.isUndefinedOrNull(data) || this.isEmpty(data);
    }

    public isValidDate(d) {
        return d instanceof Date && !isNaN(d.getTime());
    }

    public getJsDateFromExcel(serial) {
        var utc_days = Math.floor(serial - 25568);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);

        var fractional_day = serial - Math.floor(serial) + 0.0000001;

        var total_seconds = Math.floor(86400 * fractional_day);

        var seconds = total_seconds % 60;

        total_seconds -= seconds;

        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;

        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    }

    public svgToBase64(element: Element) {
        var s = new XMLSerializer().serializeToString(element);
        var encodedData = window.btoa(s);   
        return 'data:image/svg+xml;base64,' + encodedData;
    }

    public getNombreMes(fecha : Date){
        var month = new Array();
        month[0] = "Enero";
        month[1] = "Febrero";
        month[2] = "Marzo";
        month[3] = "Abril";
        month[4] = "Mayo";
        month[5] = "Junio";
        month[6] = "Julio";
        month[7] = "Agosto";
        month[8] = "Setiembre";
        month[9] = "Octubre";
        month[10] = "Noviembre";
        month[11] = "Diciembre";
        return month[fecha.getMonth()];
    }


}