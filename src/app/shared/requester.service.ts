import { BrowserStorageService } from './browserstorage.service';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";

@Injectable()
export class RequesterService {

    headers: HttpHeaders;

    browserStorageSubscription: Subscription;

    constructor(private httpClient: HttpClient, private browserStorageService: BrowserStorageService) {

        this.browserStorageSubscription = this.browserStorageService.tokenActualChanged.subscribe(
            () => {
                this.headers = new HttpHeaders({
                    'Authorization': 'Bearer ' + this.browserStorageService.get("token")
                });
            }
        )


    }

    request(url: string, method: string, body: {}, options: {}): Observable<HttpEvent<any>> {
        options["headers"] = this.headers;
        return this.httpClient.request(new HttpRequest(method, url, body, options));
    }

    get<T>(url: string, options: {}): Observable<T> {
        options["headers"] = this.headers;
        return this.httpClient.get<T>(url, options);
    }

    post<T>(url: string, body: any, options: {}): Observable<T> {
        options["headers"] = this.headers;
        return this.httpClient.post<T>(url, body, options);
    }

    put<T>(url: string, body: any, options: {}): Observable<T> {
        options["headers"] = this.headers;
        return this.httpClient.put<T>(url, body, options);
    }
}