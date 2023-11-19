import { HttpRequest } from '@angular/common/http';

export function addHttpHeader(req: HttpRequest<unknown>, key: string, value: string): HttpRequest<any> {
  return add(req, 'setHeaders', key, value);
}

export function addHttpParam(req: HttpRequest<unknown>, key: string, value: string): HttpRequest<any> {
  return add(req, 'setParams', key, value);
}

function add(req: HttpRequest<unknown>, updateKey: 'setHeaders' | 'setParams', key: string, value: string,): HttpRequest<unknown> {
  return req.clone({ [updateKey]: { [key]: value } });
}
