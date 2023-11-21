import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KamereonHandler } from './kamereon.handler';

@Injectable()
export class KamereonHttpClient extends HttpClient {

  public constructor(handler: KamereonHandler) {
    super(handler);
  }
}
