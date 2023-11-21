import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { authExpiredInterceptor } from './interceptors/auth-expired.interceptor';

export const AUTH_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(
    withInterceptors([authExpiredInterceptor()]),
  ),
];
