import { effect, Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { NgxRenaultSession } from '@remscodes/ngx-renault-api-client';
import { Person, VehicleLink } from '@remscodes/renault-api';
import { Nullable } from '../models/shared.models';
import { SESSION_STORAGE } from '../tokens/session-storage.token';

@Injectable({ providedIn: 'root' })
export class AppService {

  public constructor(
    @Inject(SESSION_STORAGE) private sessionStorage: Storage,
    private session: NgxRenaultSession,
  ) {
    this.observeGigyaToken();
    this.observeToken();
    this.observePersonId();
    this.observeAccountId();
  }

  public readonly gigyaToken: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('gigyaToken'));
  public readonly token: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('token'));
  public readonly vehicles: WritableSignal<VehicleLink[]> = signal([]);

  public readonly personId: WritableSignal<Nullable<string>> = signal(null);
  public readonly person: WritableSignal<Nullable<Person>> = signal(null);

  public readonly selectedAccountId: WritableSignal<Nullable<string>> = signal(this.sessionStorage.getItem('accountId'));

  public readonly selectedVin: WritableSignal<Nullable<string>> = signal(null);

  private observeGigyaToken(): void {
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
  }

  private observeToken(): void {
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

  private observePersonId(): void {
    effect(() => {
      const personId: Nullable<string> = this.personId();
      if (!personId) {
        this.session.personId = undefined;
        return;
      }

      this.session.personId = personId;
    });
  }

  private observeAccountId(): void {
    effect(() => {
      const accountId: Nullable<string> = this.selectedAccountId();
      if (!accountId) {
        this.sessionStorage.removeItem('accountId');
        this.session.accountId = undefined;
        return;
      }

      this.sessionStorage.setItem('accountId', accountId);
      this.session.accountId = accountId;
    });
  }
}
