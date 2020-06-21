import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private toastr: ToastrService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(errorResponse => {
                if (errorResponse) {

                    if (errorResponse.status === 400) {
                        if (errorResponse.error.errors) {
                            throw errorResponse.error;
                        } else {
                            this.toastr.error(errorResponse.error.message, errorResponse.error.statusCode);
                        }
                    }

                    if (errorResponse.status === 401) {
                        this.toastr.error(errorResponse.error.message, errorResponse.error.statusCode);
                    }

                    if (errorResponse.status === 404) {
                        this.router.navigateByUrl('/not-found');
                    }

                    if (errorResponse.status === 500) {
                        const navigationExtras: NavigationExtras = { state: {error: errorResponse.error}};
                        this.router.navigateByUrl('/server-error', navigationExtras);
                    }

                }

                return throwError(errorResponse);
            })
        );
    }
}
