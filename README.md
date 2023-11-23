<div align="center">
    <h1>Angular Renault API Client</h1>
    <p>Angular http client to use Renault API</p>
</div> 

<div align="center">

[![github ci](https://img.shields.io/github/actions/workflow/status/remscodes/ngx-renault-api-client/npm-ci.yml.svg?logo=github&label=CI&style=for-the-badge)](https://github.com/remscodes/ngx-renault-api-client/actions/workflows/npm-ci.yml)
[![npm version](https://img.shields.io/npm/v/@remscodes/ngx-renault-api-client.svg?style=for-the-badge&logo=npm)](https://www.npmjs.org/package/@remscodes/ngx-renault-api-client)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@remscodes/ngx-renault-api-client.svg?style=for-the-badge)](https://bundlephobia.com/package/@remscodes/ngx-renault-api-client)
[![license](https://img.shields.io/github/license/remscodes/ngx-renault-api-client.svg?style=for-the-badge)](LICENSE)

</div>

## Installation

```shell
npm install @remscodes/ngx-renault-api-client
```

## Usage

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRenaultClient } from '@remscodes/ngx-renault-api-client';

export const appConfig: ApplicationConfig = {
  providers: [provideRenaultClient()],
};
```

```ts
// app.component.ts
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxGigyaClient, NgxKamereonClient, NgxRenaultClient, NgxRenaultSession } from '@remscodes/ngx-renault-api-client';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [],
})
export class AppComponent {

  constructor(
    private renault: NgxRenaultClient,
    private session: NgxRenaultSession,
    private destroyRef: DestroyRef,
  ) { }

  private gigya: NgxGigyaClient = this.renault.gigya;
  private kamereon: NgxKamereonClient = this.renault.kamereon;

  // (1) Login to gigya service
  login(): void {
    // will store automatically `gigyaToken` into session.
    this.gigya.login('myLogin', 'myPassword')
      .pipe(
        // will store automatically `personId` into session
        concatMap(() => this.gigya.getAccountInfo()),
        // will store automatically `token` into session
        concatMap(() => this.gigya.getJwt()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => console.info('Logged in.'),
      });
  }

  // (2) Get user's accounts
  getAccounts(): void {
    this.kamereon.getPerson(this.session.personId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ accounts }) => {
          // Select the accountId you want
          this.session.accountId = accounts[0].accountId;
        },
      });
  }

  // (3) Get account's vehicles
  getVehicles(): void {
    this.kamereon.getAccountVehicles(accountId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ vehicleLinks }) => {
          // Select the vin you want 
          this.vin = vehicleLinks[0].vin;
        },
      });
  }

  // (4) Get current battery status
  getBatteryStatus(): void {
    this.kamereon.readBatteryStatus(this.vin)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (batteryStatus) => {
          // handle battery status
        },
      });
  }

  // (5) Invalidate the gigya token (stored in session)
  logout(): void {
    this.gigya.logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => console.info('Logged out.'),
      });
  }
}
```

### Examples

- [With standalone component as root](./projects/ngx-renault-api-client-demo)
- [With module app as root](./projects/ngx-renault-api-client-demo-legacy)

## Disclaimer

This project is not affiliated with, endorsed by, or connected to Renault. I accept no responsibility for any consequences, intentional or accidental, resulting from interaction with the Renault's API using this project.

## Credit

Resources API based on [@remscodes/renault-api](https://github.com/remscodes/renault-api#credit).

## License

[MIT](LICENSE) © Rémy Abitbol.
