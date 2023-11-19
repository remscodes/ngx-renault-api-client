import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountInfo, GigyaApi, LoginInfo, LogoutInfo, TokenInfo, TokenPublicInfo } from '@remscodes/renault-api';
import { map, Observable, tap } from 'rxjs';
import { NgxRenaultSession } from '../ngx-renault-session.service';
import { fixGigyaResponse } from './gigya-fix';

@Injectable()
export class NgxGigyaClient {

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly session: NgxRenaultSession,
  ) { }

  /**
   * Login to Gigya service.
   * @param {string} loginID - The user login.
   * @param {string} password - The user password.
   */
  public login(loginID: string, password: string): Observable<LoginInfo> {
    const params: HttpParams = new HttpParams({
      fromObject: { loginID, password },
    });
    return this.httpClient
      .post<LoginInfo>(GigyaApi.LOGIN_URL, {}, { params, observe: 'response' })
      .pipe(
        map((res: HttpResponse<LoginInfo>) => fixGigyaResponse(res)),
        map((res: HttpResponse<LoginInfo>) => res.body!),
        tap({
          next: (result: LoginInfo) => this.session.gigyaToken = result.sessionInfo?.cookieValue,
        }),
      );
  }

  /**
   * Get account info.
   */
  public getAccountInfo(): Observable<AccountInfo> {
    return this.httpClient
      .post<AccountInfo>(GigyaApi.GET_ACCOUNT_INFO_URL, {}, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<AccountInfo>) => fixGigyaResponse(res)),
        map((res: HttpResponse<AccountInfo>) => res.body!),
        tap({
          next: (result: AccountInfo) => this.session.personId = result.data?.personId,
        }),
      );
  }

  /**
   * Get JWT.
   * @param {number} [expiration = 900] - The chosen expiration (in milliseconds) of the JWT.
   */
  public getJwt(expiration: number = 900): Observable<TokenInfo> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        fields: 'data.personId,data.gigyaDataCenter',
        expiration,
      },
    });
    return this.httpClient
      .post<TokenInfo>(GigyaApi.GET_JWT_URL, {}, { params, observe: 'response' })
      .pipe(
        map((res: HttpResponse<TokenInfo>) => fixGigyaResponse(res)),
        map((res: HttpResponse<TokenInfo>) => res.body!),
        tap({
          next: (token: TokenInfo) => this.session.token = token.id_token,
        }),
      );
  }

  /**
   * Get public info about JWT key.
   */
  public getJwtPublicKey(): Observable<TokenPublicInfo> {
    return this.httpClient
      .post<TokenPublicInfo>(GigyaApi.GET_JWT_PUBLIC_KEY_URL, {}, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<TokenPublicInfo>) => fixGigyaResponse(res)),
        map((res: HttpResponse<TokenPublicInfo>) => res.body!),
      );
  }

  /**
   * Logout from Gigya service.
   */
  public logout(): Observable<LogoutInfo> {
    return this.httpClient
      .post<LogoutInfo>(GigyaApi.LOGOUT_URL, {}, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<LogoutInfo>) => fixGigyaResponse(res)),
        map((res: HttpResponse<LogoutInfo>) => res.body!),
      );
  }
}
