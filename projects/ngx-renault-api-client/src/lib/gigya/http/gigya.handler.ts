import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GigyaApi } from '@remscodes/renault-api';
import { Observable } from 'rxjs';
import { Optional } from '../../models/shared.model';
import { NgxRenaultSession } from '../../ngx-renault-session.service';
import { addHttpParam } from '../../utils/request.utils';

@Injectable()
export class GigyaHandler implements HttpHandler {

  public constructor(
    private defaultHandler: HttpHandler,
    private session: NgxRenaultSession,
  ) { }

  public handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    req = addHttpParam(req, 'apikey', GigyaApi.KEY);

    const token: Optional<string> = this.session.gigyaToken;
    if (token) req = addHttpParam(req, 'login_token', token);

    return this.defaultHandler.handle(req);
  }
}
