import { Injectable } from "@angular/core";


@Injectable()
export class UtilsService {

    constructor() { }

    public isEmpty(data): boolean {
        if ((data instanceof Array && data.length == 0) || (data instanceof String && data.trim().length === 0)) {
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

}