import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { NotifierService } from "angular-notifier";


@Injectable()
export class RequesterService {

    headers: HttpHeaders;
    onLoading: Subject<boolean> = new Subject<boolean>();

    constructor(
        private httpClient: HttpClient,
        private notifier: NotifierService
    ) { }

    request(url: string, method: string, body: {}, options: {}): Observable<HttpEvent<any>> {
        this.onLoading.next(true);
        return this.httpClient.request(new HttpRequest(method, url, body, options)).do(
            data => {
                this.onLoading.next(false);    
                return data;
            },
            error => {
                this.onLoading.next(false);
                if (error.status === 500  && (error.message.includes('Bad chunk') || error.message.includes('length'))) {
                    this.notifier.notify('error', 'Ha ocurrido un problema. Recargue la página');
                }
                console.log(error);
                return error;
            }
        );
    }

    get<T>(url: string, options: {}): Observable<T> {
        this.onLoading.next(true);
        return this.httpClient.get<T>(url, options).do(
            data => {
                this.onLoading.next(false);    
                return data;
            },
            error => {
                this.onLoading.next(false);    
                if (error.status === 500  && (error.message.includes('Bad chunk') || error.message.includes('length'))) {
                    this.notifier.notify('error', 'Ha ocurrido un problema. Recargue la página');
                }
                console.log(error);
                return error;
            }
        );
    }

    post<T>(url: string, body: any, options: {}): Observable<T> {
        this.onLoading.next(true);
        return this.httpClient.post<T>(url, body, options).do(
            data => {
                this.onLoading.next(false);    
                return data;
            },
            error => {
                this.onLoading.next(false);    
                if (error.status === 500  && (error.message.includes('Bad chunk') || error.message.includes('length'))) {
                    this.notifier.notify('error', 'Ha ocurrido un problema. Recargue la página');
                }
                console.log(error);
                return error;
            }
        );
    }

    put<T>(url: string, body: any, options: {}): Observable<T> {
        this.onLoading.next(true);
        return this.httpClient.put<T>(url, body, options).do(
            data => {
                this.onLoading.next(false);    
                return data;
            },
            error => {
                this.onLoading.next(false);    
                if (error.status === 500  && (error.message.includes('Bad chunk') || error.message.includes('length'))) {
                    this.notifier.notify('error', 'Ha ocurrido un problema. Recargue la página');
                }
                console.log(error);
                return error;
            }
        );
    }

    delete<T>(url: string, options: {}): Observable<T> {
        this.onLoading.next(true);
        return this.httpClient.delete<T>(url, options).do(
            data => {
                this.onLoading.next(false);    
                return data;
            },
            error => {
                this.onLoading.next(false);    
                if (error.status === 500  && (error.message.includes('Bad chunk') || error.message.includes('length'))) {
                    this.notifier.notify('error', 'Ha ocurrido un problema. Recargue la página');
                }
                console.log(error);
                return error;
            }
        );
    }
}