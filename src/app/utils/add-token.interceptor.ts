import { error } from 'console';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../Services/error.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  platformId=inject(PLATFORM_ID);
  constructor(private router: Router, private errorServices:ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=null;
   if(isPlatformBrowser(this.platformId)){
     token = localStorage.getItem('token');
   }


    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }else{
      this.router.navigate(['/login']);
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        this.errorServices.msjError(error);
            if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => new Error('Error'));
      })
    );
  }
}
