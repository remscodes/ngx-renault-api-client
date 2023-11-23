import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const SESSION_STORAGE: InjectionToken<Storage> = new InjectionToken('Session Storage', {
  providedIn: 'root',
  factory: () => inject(WINDOW).sessionStorage,
});
