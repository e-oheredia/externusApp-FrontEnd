import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

@Injectable()

export class WriteExcelService {
    
    constructor(){}

    jsonToExcel(objects: Object[], wbName: string) {
        let keys: string[] = Object.keys(objects[0]);
        let celdas = [];
        celdas.push(keys);
        objects.forEach(object => {
            let celda = [];
            keys.forEach(key => {
                celda.push(object[key]);
            });
            celdas.push(celda);
        });        
        var ws = XLSX.utils.aoa_to_sheet(celdas);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, wbName);
        XLSX.writeFile(wb, wbName + ".xlsx");
    }

}
