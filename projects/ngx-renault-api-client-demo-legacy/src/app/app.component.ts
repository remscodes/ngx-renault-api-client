import { Component, computed, DestroyRef, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account, AccountInfo, BatteryStatus, LoginInfo, Person, TokenInfo, Vehicles } from '@remscodes/renault-api';
import { concatMap } from 'rxjs';
import { NgxGigyaClient } from '../../../ngx-renault-api-client/src/lib/gigya/ngx-gigya-client';
import { NgxKamereonClient } from '../../../ngx-renault-api-client/src/lib/kamereon/ngx-kamereon-client';
import { NgxRenaultClient } from '../../../ngx-renault-api-client/src/lib/ngx-renault-client.service';
import { Nullable, Optional } from './models/shared.models';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public constructor(
    private renaultClient: NgxRenaultClient,
    private appService: AppService,
    private destroyRef: DestroyRef,
  ) { }

  private gigya: NgxGigyaClient = this.renaultClient.gigya;
  private kamereon: NgxKamereonClient = this.renaultClient.kamereon;

  public form: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public formAccounts: FormGroup = new FormGroup({
    accountId: new FormControl('', Validators.required),
  });
  public formVins: FormGroup = new FormGroup({
    vin: new FormControl('', Validators.required),
  });

  public token: Signal<Nullable<string>> = this.appService.token;

  public accounts: Signal<Account[]> = computed(() => (this.appService.person()?.accounts ?? []));
  public vins: Signal<string[]> = computed(() => (this.appService.vehicles().map(v => v.vin!) ?? []));
  public vin = this.appService.selectedVin;

  public batteryStatus: Optional<BatteryStatus>;

  public login(): void {
    if (this.form.invalid) return;

    const { login, password } = this.form.value;

    this.gigya.login(login, password)
      .pipe(
        concatMap(({ sessionInfo }: LoginInfo) => {
          this.appService.gigyaToken.set(sessionInfo?.cookieValue!);
          return this.gigya.getJwt();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ id_token }: TokenInfo) => {
          this.appService.token.set(id_token!);
        },
      });
  }

  public getInfos(): void {
    this.gigya.getJwt().pipe(
      concatMap(({ id_token }: TokenInfo) => {
        this.appService.token.set(id_token!);
        return this.gigya.getAccountInfo();
      }),
      concatMap(({ data }: AccountInfo) => {
        const personId = data!.personId!;
        this.appService.personId.set(personId);
        return this.kamereon.getPerson(personId);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (person: Person) => {
        this.appService.person.set(person);
      },
    });
  }

  public getBatteryStatus(): void {
    this.kamereon.readBatteryStatus(this.appService.selectedVin()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (batteryStatus: BatteryStatus) => this.batteryStatus = batteryStatus,
      });
  }

  public selectAccount(): void {
    if (this.formAccounts.invalid) return;

    const { accountId } = this.formAccounts.value;

    this.appService.selectedAccountId.set(accountId);

    this.kamereon.getAccountVehicles(accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (vehicles: Vehicles) => this.appService.vehicles.set(vehicles.vehicleLinks!),
      });
  }

  public selectVin(): void {
    if (this.formVins.invalid) return;

    const { vin } = this.formVins.value;

    this.appService.selectedVin.set(vin);
  }
}
