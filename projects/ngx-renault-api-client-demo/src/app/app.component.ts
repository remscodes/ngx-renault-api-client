import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxGigyaClient, NgxKamereonClient, NgxRenaultClient } from '@remscodes/ngx-renault-api-client';
import { LoginInfo, TokenInfo } from '@remscodes/renault-api';
import { AppService } from './services/app.service';
import { Nullable } from './models/shared.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
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

  public form: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public gigyaToken: Signal<Nullable<string>> = this.appService.gigyaToken;

  public login(): void {
    if (this.form.invalid) return;

    const { login, password } = this.form.value;

    this.gigya.login(login, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ sessionInfo }: LoginInfo) => this.appService.gigyaToken.set(sessionInfo?.cookieValue!),
      });
  }

  public getJwt(): void {
    this.gigya.getJwt()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ id_token }: TokenInfo) => this.appService.token.set(id_token!),
      });
  }
}
