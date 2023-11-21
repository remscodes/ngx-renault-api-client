import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { errorInterceptor } from './interceptors/error.interceptor';

export const ERROR_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(
    withInterceptors([errorInterceptor()]),
  ),
];
