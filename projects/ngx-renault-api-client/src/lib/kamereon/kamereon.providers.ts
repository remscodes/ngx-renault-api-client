import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { kamereonInterceptor } from './interceptors/kamereon.interceptor';

export const KAMEREON_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(
    withInterceptors([kamereonInterceptor()]),
  ),
];
