import { ApplicationConfig } from '@angular/core';
import { provideRenaultClient } from '@remscodes/ngx-renault-api-client';
import { AUTH_PROVIDERS } from './core/auth/auth.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRenaultClient(),
    AUTH_PROVIDERS,
  ],
};
