import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { KamereonHandler } from './http/kamereon.handler';
import { KamereonHttpClient } from './http/kamereon.http-client';
import { NgxKamereonClient } from './ngx-kamereon-client';

export const KAMEREON_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  KamereonHandler,
  KamereonHttpClient,
  NgxKamereonClient,
];
