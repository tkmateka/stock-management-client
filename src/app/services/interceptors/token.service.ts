import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ApiService } from '../api.service';
import { TokenService as _TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements HttpInterceptor {

  constructor(private tokenService: _TokenService, private api: ApiService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    authReq = this.addTokenHeader(req, this.tokenService.getItem('tokens')?.accessToken);

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 403) {
          // Refresh Token
          return this.refreshToken(req, next);
        }
        return throwError(err);
      })
    );
  }

  refreshToken(req: HttpRequest<any>, next: HttpHandler) {
    let token = { token: this.tokenService.getItem('tokens')?.refreshToken };

    return this.api.post('refresh_token', token).pipe(
      switchMap((data: any) => {
        this.tokenService.setItem('tokens', data);
        return next.handle(this.addTokenHeader(req, data.jwtToken));
      }),
      catchError(err => {
        this.tokenService.logout();
        return throwError(err);
      })
    );
  }

  addTokenHeader(req: HttpRequest<any>, token: any) {
    return req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
  }
}
