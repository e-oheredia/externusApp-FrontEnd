import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

type AOA = any[][];

@Injectable()
export class ReadExcelService {
    
    constructor(){}

    excelToJson(file: File, sheet: number, callback: Function){
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
            const wsname: string = wb.SheetNames[sheet];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            const data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
            callback(data);
        }
        reader.readAsBinaryString(file);
    }

}
