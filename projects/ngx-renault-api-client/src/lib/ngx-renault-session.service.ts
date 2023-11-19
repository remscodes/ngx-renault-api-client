import { Injectable } from '@angular/core';
import { Optional } from './models/shared.model';

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
   * Get by Gigya login API.
   */
  public gigyaToken: Optional<string>;
  /**
   * Token to use Kamereon API.
   * Get by Gigya getJWT API.
   */
  public token: Optional<string>;
  /**
   * Selected person id.
   */
  public personId: Optional<string>;
  /**
   * Selected account id.
   */
  public accountId: Optional<string>;
}
