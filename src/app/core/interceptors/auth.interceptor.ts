import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../shared/services/auth/auth.service';

const privateUrls = [
    'addresses',
    'countries',
    'credit-cards',
    'delivery-options',
    'promotions',
    'orders',
    'suborders',
    'cart',
    'users',
    'roles'
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const targetUrl = (request.url.split(`${environment.apiUrl}`)[1]).split('/')[1];

        if((('products' === targetUrl) && ('sellers' !== request.url.split(`${environment.apiUrl}`)[1].split('/')[2]) && !['POST', 'PATCH', 'DELETE'].includes(request.method))
            || (('categories' === targetUrl) && !['POST', 'PATCH', 'DELETE'].includes(request.method))
            || (('reviews' === targetUrl) && !['POST', 'PATCH', 'DELETE'].includes(request.method))
            || (('products' !== targetUrl) && ('categories' !== targetUrl) && ('reviews' !== targetUrl) && !privateUrls.includes(targetUrl)))
            return next.handle(request);

        const headers = new HttpHeaders()
            .append('Authorization', `Bearer ${this.authService.getAccessToken()}`);

        return next.handle(request.clone({ headers })).pipe(
            catchError(error => {

                if(error.status == 401) {

                    this.authService.signOut().subscribe();

                    this.router.navigateByUrl('/sign-in');

                    if(request.url.includes('auth/sign-in'))
                        throw error;
                    else
                        return EMPTY;

                }

                throw error;

            })
        );

    }

}
