import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GigyaHandler } from './gigya.handler';

@Injectable()
export class GigyaHttpClient extends HttpClient {

  public constructor(handler: GigyaHandler) {
    super(handler);
  }
}
