import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class RequesterService {

    headers: HttpHeaders;

    constructor(
        private httpClient: HttpClient
    ) { }

    request(url: string, method: string, body: {}, options: {}): Observable<HttpEvent<any>> {
        return this.httpClient.request(new HttpRequest(method, url, body, options));
    }

    get<T>(url: string, options: {}): Observable<T> {
        return this.httpClient.get<T>(url, options);
    }

    post<T>(url: string, body: any, options: {}): Observable<T> {
        return this.httpClient.post<T>(url, body, options);
    }

    put<T>(url: string, body: any, options: {}): Observable<T> {
        return this.httpClient.put<T>(url, body, options);
    }

    delete<T>(url: string, options: {}): Observable<T> {
        return this.httpClient.delete<T>(url, options);
    }
}