import { effect, Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { NgxRenaultSession } from '@remscodes/ngx-renault-api-client';
import { Nullable } from '../models/shared.models';
import { SESSION_STORAGE } from '../tokens/session-storage.token';

@Injectable({ providedIn: 'root' })
export class AppService {

  public constructor(
    @Inject(SESSION_STORAGE) private sessionStorage: Storage,
    private session: NgxRenaultSession,
  ) {
    this.observe();
  }

  public gigyaToken: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('gigya-token'));
  public token: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('token'));

  private observe() {
    effect(() => {
      const token: Nullable<string> = this.gigyaToken();
      if (!token) {
        this.sessionStorage.removeItem('gigyaToken');
        this.session.gigyaToken = undefined;
        return;
      }

      this.sessionStorage.setItem('gigyaToken', token);
      this.session.gigyaToken = token;
    });

    effect(() => {
      const token: Nullable<string> = this.token();
      if (!token) {
        this.sessionStorage.removeItem('token');
        this.session.token = undefined;
        return;
      }

      this.sessionStorage.setItem('token', token);
      this.session.token = token;
    });
  }
}
