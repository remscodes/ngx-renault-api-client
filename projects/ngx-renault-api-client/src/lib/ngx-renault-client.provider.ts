import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GIGYA_PROVIDERS } from './gigya/gigya.providers';
import { KAMEREON_PROVIDERS } from './kamereon/kamereon.providers';
import { NgxRenaultClient } from './ngx-renault-client.service';
import { NgxRenaultSession } from './ngx-renault-session.service';

/**
 * Configures Angular Renault Client to be available for injection.
 */
export function provideRenaultClient(): EnvironmentProviders {
  return makeEnvironmentProviders([
    GIGYA_PROVIDERS,
    KAMEREON_PROVIDERS,
    NgxRenaultClient,
    NgxRenaultSession,
  ]);
}
