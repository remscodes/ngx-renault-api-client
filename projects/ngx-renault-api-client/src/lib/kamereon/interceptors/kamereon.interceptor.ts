import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { KamereonApi } from '@remscodes/renault-api';
import { NgxRenaultSession } from '../../ngx-renault-session.service';
import { Optional } from '../../models/shared.model';
import { addHttpHeader } from '../../utils/request.utils';

export function kamereonInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const session: NgxRenaultSession = inject(NgxRenaultSession);

    addHttpHeader(req, 'apikey', KamereonApi.KEY);
    addHttpHeader(req, 'accept', 'application/json');
    addHttpHeader(req, 'content-type', 'application/vnd.api+json');
    addHttpHeader(req, 'country', session.country);

    const token: Optional<string> = session.token;
    if (token) addHttpHeader(req, 'x-gigya-id_token', token);

    return next(req);
  };
}
