import { Injectable } from '@angular/core';
import { Optional } from './models/shared.model';

/**
 * Session to store user info.
 */
@Injectable()
export class NgxRenaultSession {

  /**
   * Locale that will be used to format date.
   * @default "fr_FR"
   */
  public locale: string = 'fr_FR';
  /**
   * Country code that will use as http param for Kamereon.
   * @default "FR"
   */
  public country: string = 'FR';

  /**
   * Token to use Gigya getJWT API.
   *
   * Automatically set when Gigya login API is called and succeed.
   */
  public gigyaToken: Optional<string>;
  /**
   * Token to use Kamereon API.
   *
   * Automatically set when Gigya getJWT API is called and succeed.
   */
  public token: Optional<string>;
  /**
   * Selected person id.
   *
   * Automatically set when Gigya getAccountInfo API is called and succeed.
   */
  public personId: Optional<string>;
  /**
   * Selected account id.
   *
   * Need to be set in order to be automatically passed into each Kamereon API functions that needs it.
   *
   * Otherwise, it needs to be manually passed as function argument.
   */
  public accountId: Optional<string>;
}
