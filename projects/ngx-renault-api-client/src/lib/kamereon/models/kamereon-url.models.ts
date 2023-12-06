import { HttpParams } from '@angular/common/http';
import { KamereonApi } from '@remscodes/renault-api';
import { MethodsOf, Optional, PrefixWith } from '../../models/shared.model';
import { NgxKamereonClient } from '../ngx-kamereon-client';

/** @internal **/
export interface ReadArgs extends CommonArgs {
  apiUrl: ReadApiUrl;
  params?: HttpParams;
}

/** @internal **/
export interface PerformArgs extends CommonArgs {
  apiUrl: PerformApiUrl;
  data: any;
}

/** @internal **/
interface CommonArgs {
  method: KamereonMethod;
  accountId: Optional<string>;
  vin: Optional<string>;
}

/** @internal **/
export type ReadApiUrl = keyof Omit<typeof KamereonApi, 'KEY' | PrefixWith<'PERFORM_'>>

/** @internal **/
export type PerformApiUrl = keyof Pick<typeof KamereonApi, Extract<keyof typeof KamereonApi, PrefixWith<'PERFORM_'>>>

/** @internal **/
export type KamereonMethod = keyof MethodsOf<NgxKamereonClient> & string;
