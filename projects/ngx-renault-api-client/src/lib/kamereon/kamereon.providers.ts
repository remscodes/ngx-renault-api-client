import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { kamereonInterceptor } from './interceptors/kamereon.interceptor';
import { NgxKamereonClient } from './ngx-kamereon-client';

export const KAMEREON_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(
    withInterceptors([kamereonInterceptor()]),
  ),
  NgxKamereonClient
];
