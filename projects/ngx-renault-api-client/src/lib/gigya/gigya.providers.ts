import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { GigyaHandler } from './http/gigya.handler';
import { GigyaHttpClient } from './http/gigya.http-client';
import { NgxGigyaClient } from './ngx-gigya-client';

export const GIGYA_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  GigyaHandler,
  GigyaHttpClient,
  NgxGigyaClient,
];
