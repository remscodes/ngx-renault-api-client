import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@demo-common/services';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

  public constructor(
    private appService: AppService,
  ) { }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if (status !== 401) return;

          console.info('Session expired !');
          this.appService.token.set(null);
        },
      }),
    );
  }
}
