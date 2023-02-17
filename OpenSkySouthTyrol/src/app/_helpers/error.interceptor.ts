//angular imports
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@app/_models';
//auth service import
import { AuthenticationService } from '@app/_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  currentUser!: User;

  constructor(private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      // auto logout if 401 response returned from api
      if (err.status === 401) {
        this.authenticationService.logout();
        location.reload();
      }
      //sets error text
      const error = err.error.message || err.statusText;
      return throwError(() => new Error(error));
    }))
  }
}
