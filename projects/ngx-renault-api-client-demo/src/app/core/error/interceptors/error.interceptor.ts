import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export function errorInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req);
  };
}
