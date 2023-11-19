import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { gigyaInterceptor } from './interceptors/gigya.interceptor';
import { NgxGigyaClient } from './ngx-gigya-client';

export const GIGYA_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(
    withInterceptors([gigyaInterceptor()]),
  ),
  NgxGigyaClient
];
