import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { GigyaApi } from '@remscodes/renault-api';
import { NgxRenaultSession } from '../../ngx-renault-session.service';
import { Optional } from '../../models/shared.model';
import { addHttpParam } from '../../utils/request.utils';

export function gigyaInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const session: NgxRenaultSession = inject(NgxRenaultSession);

    addHttpParam(req, 'apikey', GigyaApi.KEY);

    const token: Optional<string> = session.gigyaToken;
    if (token) addHttpParam(req, 'login_token', token);

    return next(req);
  };
}
