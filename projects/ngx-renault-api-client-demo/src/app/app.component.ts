import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, DestroyRef, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Nullable, Optional } from '@demo-common/models';
import { AppService } from '@demo-common/services';
import { basicForm } from '@demo-common/utils';
import { NgxGigyaClient, NgxKamereonClient, NgxRenaultClient } from '@remscodes/ngx-renault-api-client';
import { Account, AccountInfo, BatteryStatus, LoginInfo, Person, TokenInfo, Vehicles } from '@remscodes/renault-api';
import { concatMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class AppComponent {

  public constructor(
    private renaultClient: NgxRenaultClient,
    private appService: AppService,
    private destroyRef: DestroyRef,
  ) { }

  private gigya: NgxGigyaClient = this.renaultClient.gigya;
  private kamereon: NgxKamereonClient = this.renaultClient.kamereon;

  public formLogin: FormGroup = basicForm(['login', 'password']);
  public formAccounts: FormGroup = basicForm(['accountId']);
  public formVins: FormGroup = basicForm(['vin']);

  public token: Signal<Nullable<string>> = this.appService.token;

  public accounts: Signal<Account[]> = computed(() => (this.appService.person()?.accounts ?? []));
  public vins: Signal<string[]> = computed(() => (this.appService.vehicles().map(v => v.vin!) ?? []));
  public vin: Signal<Nullable<string>> = this.appService.selectedVin;

  public batteryStatus: Optional<BatteryStatus>;

  public login(): void {
    if (this.formLogin.invalid) return;

    const { login, password } = this.formLogin.value;

    this.gigya.login(login, password)
      .pipe(
        tap(({ sessionInfo }: LoginInfo) => this.appService.gigyaToken.set(sessionInfo?.cookieValue!)),
        concatMap(() => this.gigya.getJwt()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ id_token }: TokenInfo) => this.appService.token.set(id_token!),
      });
  }

  public getInfos(): void {
    this.gigya.getJwt()
      .pipe(
        tap(({ id_token }: TokenInfo) => this.appService.token.set(id_token!)),
        concatMap(() => this.gigya.getAccountInfo()),
        concatMap(({ data }: AccountInfo) => this.kamereon.getPerson(data!.personId!)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (person: Person) => this.appService.person.set(person),
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
