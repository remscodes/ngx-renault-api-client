import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GIGYA_PROVIDERS } from './gigya/gigya.providers';
import { NgxGigyaClient } from './gigya/ngx-gigya-client';
import { KAMEREON_PROVIDERS } from './kamereon/kamereon.providers';
import { NgxKamereonClient } from './kamereon/ngx-kamereon-client';
import { NgxRenaultClient } from './ngx-renault-client.service';
import { NgxRenaultSession } from './ngx-renault-session.service';

export function provideRenaultClient(): EnvironmentProviders {
  return makeEnvironmentProviders([
    GIGYA_PROVIDERS,
    KAMEREON_PROVIDERS,
    NgxRenaultClient,
    NgxGigyaClient,
    NgxKamereonClient,
    NgxRenaultSession,
  ]);
}
