import { computed, effect, Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Nullable } from '@demo-common/models';
import { SESSION_STORAGE } from '@demo-common/tokens';
import { NgxRenaultSession } from '@remscodes/ngx-renault-api-client';
import { Account, Person, VehicleLink } from '@remscodes/renault-api';

@Injectable({ providedIn: 'root' })
export class AppService {

  public constructor(
    @Inject(SESSION_STORAGE) private sessionStorage: Storage,
    private session: NgxRenaultSession,
  ) {
    this.observeGigyaToken();
    this.observeToken();
    this.observeAccountId();
    this.observeVin();
  }

  public gigyaToken: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('gigyaToken'));
  public token: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('token'));
  public vehicles: WritableSignal<VehicleLink[]> = signal([]);
  public vins: Signal<string[]> = computed(() => (this.vehicles().map(v => v.vin!) ?? []));

  public person: WritableSignal<Nullable<Person>> = signal(null);
  public accounts: Signal<Account[]> = computed(() => (this.person()?.accounts ?? []));

  public selectedAccountId: WritableSignal<Nullable<string>> = signal(this.sessionStorage.getItem('accountId'));
  public selectedVin: WritableSignal<Nullable<string>> = signal(window.sessionStorage.getItem('vin'));

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

  private observeVin(): void {
    effect(() => {
      const vin: Nullable<string> = this.selectedVin();
      if (!vin) return;

      this.sessionStorage.setItem('vin', vin);
      this.session.vin = vin;
    });
  }
}
