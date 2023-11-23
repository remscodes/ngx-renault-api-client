import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideRenaultClient } from '@remscodes/ngx-renault-api-client';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { ErrorModule } from './core/error/error.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    ErrorModule,
  ],
  providers: [
    provideRenaultClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
