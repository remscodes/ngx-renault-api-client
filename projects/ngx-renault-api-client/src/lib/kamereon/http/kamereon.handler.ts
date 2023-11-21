import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KamereonApi } from '@remscodes/renault-api';
import { Observable } from 'rxjs';
import { Optional } from '../../models/shared.model';
import { NgxRenaultSession } from '../../ngx-renault-session.service';
import { addHttpHeader } from '../../utils/request.utils';

@Injectable()
export class KamereonHandler implements HttpHandler {

  public constructor(
    private defaultHandler: HttpHandler,
    private session: NgxRenaultSession,
  ) { }

  public handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    req = addHttpHeader(req, 'apikey', KamereonApi.KEY);
    req = addHttpHeader(req, 'accept', 'application/json');
    req = addHttpHeader(req, 'content-type', 'application/vnd.api+json');
    req = addHttpHeader(req, 'country', this.session.country);

    const token: Optional<string> = this.session.token;
    if (token) req = addHttpHeader(req, 'x-gigya-id_token', token);

    return this.defaultHandler.handle(req);
  }
}
