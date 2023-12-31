import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { GigyaErrorResponse, GigyaResponse } from '@remscodes/renault-api';

export function fixGigyaResponse<T extends GigyaResponse>(res: HttpResponse<T>): HttpResponse<T> {
  if (isGigyaErrorResponse(res)) throw responseToError(res);
  return res;
}

function isGigyaErrorResponse(res: HttpResponse<GigyaResponse>): res is HttpResponse<GigyaErrorResponse> {
  return (res.body?.statusCode ?? 0) >= 400;
}

function responseToError({ headers, body, url, statusText }: HttpResponse<GigyaErrorResponse>): HttpErrorResponse {
  return new HttpErrorResponse({
    headers,
    url: `${url}`,
    status: body?.statusCode,
    statusText,
    error: {
      message: body?.errorMessage,
      details: body?.errorDetails,
      time: body?.time,
    },
  });
}
