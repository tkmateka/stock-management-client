import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.requests = this.requests.filter(r => r !== req);
        if (this.requests.length === 0) {
          this.loaderService.hide();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.hide();
        throw error;
      })
    );
  }
}
