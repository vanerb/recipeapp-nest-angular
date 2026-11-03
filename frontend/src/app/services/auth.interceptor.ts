import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { safeStorage } from './safe-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Injector: AuthService usa HttpClient, y este interceptor forma parte de HttpClient
  constructor(private readonly injector: Injector) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    const token = safeStorage.get('auth_token');
    const authed = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authed).pipe(
      catchError((error: HttpErrorResponse) => {
        // Sesión caducada; un login fallido no lleva token y no entra aquí
        if (error.status === 401 && token) {
          this.injector.get(AuthService).clearSession();
        }
        return throwError(() => error);
      }),
    );
  }
}
