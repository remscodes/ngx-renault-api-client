import { effect, Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Nullable } from '@demo-common/models';
import { SESSION_STORAGE } from '@demo-common/tokens';
import { NgxRenaultSession } from '@remscodes/ngx-renault-api-client';
import { Person, VehicleLink } from '@remscodes/renault-api';

@Injectable({ providedIn: 'root' })
export class AppService {

  public constructor(
    @Inject(SESSION_STORAGE) private sessionStorage: Storage,
    private session: NgxRenaultSession,
  ) {
    this.observeGigyaToken();
    this.observeToken();
    this.observeAccountId();
  }

  public readonly gigyaToken: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('gigyaToken'));
  public readonly token: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('token'));
  public readonly vehicles: WritableSignal<VehicleLink[]> = signal([]);

  public readonly person: WritableSignal<Nullable<Person>> = signal(null);

  public readonly selectedAccountId: WritableSignal<Nullable<string>> = signal(this.sessionStorage.getItem('accountId'));
  public readonly selectedVin: WritableSignal<Nullable<string>> = signal(null);

  private observeGigyaToken(): void {
    effect(() => {
      const token: Nullable<string> = this.gigyaToken();
      if (!token) return;

      this.sessionStorage.setItem('gigyaToken', token);
    });
  }

  private observeToken(): void {
    effect(() => {
      const token: Nullable<string> = this.token();
      if (!token) return;

      this.sessionStorage.setItem('token', token);
    });
  }

  private observeAccountId(): void {
    effect(() => {
      const accountId: Nullable<string> = this.selectedAccountId();
      if (!accountId) return;

      this.sessionStorage.setItem('accountId', accountId);
      this.session.accountId = accountId;
    });
  }
}
