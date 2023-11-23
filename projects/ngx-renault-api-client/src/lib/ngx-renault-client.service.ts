import { Injectable } from '@angular/core';
import { NgxGigyaClient } from './gigya/ngx-gigya-client';
import { NgxKamereonClient } from './kamereon/ngx-kamereon-client';
import { NgxRenaultSession } from './ngx-renault-session.service';

/**
 * Http client to use Renault API.
 */
@Injectable()
export class NgxRenaultClient {

  public constructor(
    public readonly gigya: NgxGigyaClient,
    public readonly kamereon: NgxKamereonClient,
    public readonly session: NgxRenaultSession,
  ) { }
}
