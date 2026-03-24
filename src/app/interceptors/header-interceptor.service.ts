import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.startRequest();
    return next.handle(req).pipe(
      finalize(() => this.loadingService.endRequest())
    );
  }
}