import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
    HttpResponse, HttpUserEvent, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Router } from '@angular/router';
import { BrowserStorageService } from './browserstorage.service';
import { RequesterService } from './requester.service';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    headers: HttpHeaders;
    browserStorageSubscription: Subscription;
    peticionNuevoToken: boolean = false;

    constructor(private browserStorageService: BrowserStorageService, private router: Router, private requesterService: RequesterService) {

        //CAPTURA EL HEADER
        this.headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.browserStorageService.get("token")
        });
        console.log("ESTA ES LA headers1: " + this.headers);


        //CAPTURA EL HEADER LUEGO DE QUE EL TOKEN HAYA SIDO CAMBIADO
        this.browserStorageSubscription = this.browserStorageService.tokenActualChanged.subscribe(
            () => {
                this.headers = new HttpHeaders({
                    'Authorization': 'Bearer ' + this.browserStorageService.get("token")
                });
                console.log("ESTA ES LA headers Subscription: " + this.headers);
            }
        )


    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        let authReq = req;


        authReq = req.clone({ headers: this.headers });
        console.log("ESTA ES LA AuthReq: " + authReq);



        return next.handle(authReq).do(


            data => {
                console.log("ESTA ES LA DATA: " + data);

            },
            (error: any) => {
                if (error instanceof HttpErrorResponse) {

                    if (error.status === 498) {
                        console.log("El Token es invalido")

                    }

                    else if (error.status === 894) {
                        if (!this.peticionNuevoToken) {
                            this.peticionNuevoToken = true;
                            this.browserStorageService.set("token", this.browserStorageService.get("refreshtoken"));

                            return this.requesterService.post<any>('http://localhost:8092/token', null, {}).subscribe(
                                data => {
                                    if (data) {
                                        this.browserStorageService.set("token", data.token);
                                        this.browserStorageService.set("refreshtoken", data.rt);
                                        this.peticionNuevoToken = false;
                                    }
                                }
                            )
                        }

                        else {
                            console.log("EL REFRESH HA EXPIRADO");
                        }



                    }


                }
            })
    }






}



