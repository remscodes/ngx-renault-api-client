import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppService } from '@demo-common/services';
import { tap } from 'rxjs';

export function authExpiredInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const appService = inject(AppService);

    return next(req).pipe(
      tap({
        error: ({ status }: HttpErrorResponse) => {
          if (status !== 401) return;

          console.info('Session expired !');
          appService.token.set(null);
        },
      }),
    );
  };
}
