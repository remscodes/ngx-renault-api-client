import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionChargeMode, AdapterInfo, BatteryStatus, ChargeHistory, ChargeMode, ChargeModeInputs, Charges, ChargeScheduleInputs, ChargingSettings, Cockpit, DateFilter, HvacHistory, HvacScheduleInputs, HvacSessions, HvacSettings, HvacStartInputs, HvacStatus, KamereonApi, LockStatus, NotificationSettingsData, PERIOD_TZ_FORMAT, Person, ResStateData, VehicleContract, VehicleDetails, VehicleLocation, Vehicles } from '@remscodes/renault-api';
import { Observable } from 'rxjs';
import { emitError } from 'thror';
import { Optional } from '../models/shared.model';
import { NgxRenaultSession } from '../ngx-renault-session.service';
import { dateFilterToParams } from '../utils/date.utils';
import { KamereonHttpClient } from './http/kamereon.http-client';
import { PerformApiUrl, ReadApiUrl } from './models/kamereon-url.models';

/**
 * Http client to use Kamereon API.
 */
@Injectable()
export class NgxKamereonClient {

  public constructor(
    private readonly httpClient: KamereonHttpClient,
    public readonly session: NgxRenaultSession,
  ) { }

  /**
   * Get user person info.
   * @param {string?} personId - The person id.
   */
  public getPerson(personId?: string): Observable<Person> {
    const finalPersonId: string = this.getPersonIdOrThrow(personId);
    return this.httpClient
      .get(KamereonApi.PERSON_URL(finalPersonId));
  }

  /**
   * Get user vehicles.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getAccountVehicles(accountId?: string): Observable<Vehicles> {
    const requiredAccountId: string = this.getAccountIdOrThrow(accountId);
    return this.httpClient
      .get(KamereonApi.ACCOUNT_VEHICLES_URL(requiredAccountId));
  }

  /**
   * Get user vehicle contracts.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getVehicleContracts(vin: string, accountId?: string): Observable<VehicleContract[]> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        locale: this.session.locale,
        brand: 'RENAULT',
        connectedServicesContracts: 'true',
        warranty: 'true',
        warrantyMaintenanceContracts: 'true',
      },
    });
    return this.read('VEHICLE_CONTRACTS_URL', vin, accountId, params);
  }

  /**
   * Get user vehicle details.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getVehicleDetails(vin: string, accountId?: string): Observable<VehicleDetails> {
    return this.read('VEHICLE_DETAILS_URL', vin, accountId);
  }

  /**
   * Get vehicle adapter info.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readAdapter(vin: string, accountId?: string): Observable<AdapterInfo> {
    return this.read('READ_ADAPTER_URL', vin, accountId);
  }

  /**
   * Get vehicle battery status.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readBatteryStatus(vin: string, accountId?: string): Observable<BatteryStatus> {
    return this.read('READ_BATTERY_STATUS_URL', vin, accountId);
  }

  /**
   * Get vehicle charge history.
   * @param {DateFilter} filter - The date filter.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargeHistory(filter: DateFilter, vin: string, accountId?: string): Observable<ChargeHistory> {
    const params: HttpParams = dateFilterToParams(filter, this.session.locale);
    return this.read('READ_CHARGE_HISTORY_URL', vin, accountId, params);
  }

  /**
   * Get vehicle charge mode.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargeMode(vin: string, accountId?: string): Observable<ChargeMode> {
    return this.read('READ_CHARGE_MODE_URL', vin, accountId);
  }

  /**
   * Get vehicle charges.
   * @param {Omit<DateFilter, 'period'>} filter - The date filter.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readCharges(filter: Omit<DateFilter, 'period'>, vin: string, accountId?: string): Observable<Charges> {
    const params: HttpParams = dateFilterToParams(filter, this.session.locale);
    return this.read('READ_CHARGES_URL', vin, accountId, params);
  }

  /**
   * Get vehicle charging settings.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargingSettings(vin: string, accountId?: string): Observable<ChargingSettings> {
    return this.read('READ_CHARGING_SETTINGS_URL', vin, accountId);
  }

  /**
   * Get vehicle cockpit.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readCockpit(vin: string, accountId?: string): Observable<Cockpit> {
    return this.read('READ_COCKPIT_URL', vin, accountId);
  }

  /**
   * Get vehicle hvac history.
   * @param {DateFilter} filter - The date filter.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacHistory(filter: DateFilter, vin: string, accountId?: string): Observable<HvacHistory> {
    const params: HttpParams = dateFilterToParams(filter, this.session.locale);
    return this.read('READ_HVAC_HISTORY_URL', vin, accountId, params);
  }

  /**
   * Get vehicle hvac sessions.
   * @param {Omit<DateFilter, 'period'>} filter - The date filter.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacSessions(filter: Omit<DateFilter, 'period'>, vin: string, accountId?: string): Observable<HvacSessions> {
    const params: HttpParams = dateFilterToParams(filter, this.session.locale);
    return this.read('READ_HVAC_SESSIONS_URL', vin, accountId, params);
  }

  /**
   * Get vehicle hvac status.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacStatus(vin: string, accountId?: string): Observable<HvacStatus> {
    return this.read('READ_HVAC_STATUS_URL', vin, accountId);
  }

  /**
   * Get vehicle hvac settings.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacSettings(vin: string, accountId?: string): Observable<HvacSettings> {
    return this.read('READ_HVAC_SETTINGS_URL', vin, accountId);
  }

  /**
   * Get vehicle location.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readLocation(vin: string, accountId?: string): Observable<VehicleLocation> {
    return this.read('READ_LOCATION_URL', vin, accountId);
  }

  /**
   * Get vehicle lock status.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readLockStatus(vin: string, accountId?: string): Observable<LockStatus> {
    return this.read('READ_LOCK_STATUS_URL', vin, accountId);
  }

  /**
   * Get vehicle notification settings.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readNotificationSettings(vin: string, accountId?: string): Observable<NotificationSettingsData> {
    return this.read('READ_NOTIFICATION_SETTINGS_URL', vin, accountId);
  }

  /**
   * Get vehicle res state.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readResState(vin: string, accountId?: string): Observable<ResStateData> {
    return this.read('READ_RES_STATE_URL', vin, accountId);
  }

  /**
   * Select vehicle charge mode.
   * @param {ChargeModeInputs} inputs - The charge mode inputs.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeMode(inputs: ChargeModeInputs, vin: string, accountId?: string): Observable<ActionChargeMode> {
    const { action } = inputs;
    const data = {
      type: 'ChargeMode',
      attributes: { action },
    };
    return this.perform('PERFORM_CHARGE_MODE_URL', data, vin, accountId);
  }

  /**
   * Set vehicle charge schedule.
   * @param {ChargeScheduleInputs} inputs - The charge schedules inputs.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeSchedule(inputs: ChargeScheduleInputs, vin: string, accountId?: string): Observable<any> {
    const { schedules } = inputs;
    const data = {
      type: 'ChargeSchedule',
      attributes: { schedules },
    };
    return this.perform('PERFORM_CHARGE_SCHEDULE_URL', data, vin, accountId);
  }

  /**
   * Set vehicle hvac schedule.
   * @param {HvacScheduleInputs} inputs - The hvac schedule inputs.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacSchedule(inputs: HvacScheduleInputs, vin: string, accountId?: string): Observable<any> {
    const { schedules } = inputs;
    const data = {
      type: 'HvacSchedule',
      attributes: { schedules },
    };
    return this.perform('PERFORM_HVAC_SCHEDULE_URL', data, vin, accountId);
  }

  /**
   * Start vehicle hvac.
   * @param {HvacStartInputs} inputs - The hvac inputs.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacStart(inputs: HvacStartInputs, vin: string, accountId?: string): Observable<any> {
    const { targetTemperature, startDateTime } = inputs;
    const data: any = {
      type: 'HvacStart',
      attributes: { action: 'start', targetTemperature },
    };
    if (startDateTime) data.attributes.startDateTime = formatDate(startDateTime, PERIOD_TZ_FORMAT, this.session.locale);
    return this.perform('PERFORM_HVAC_START_URL', data, vin, accountId);
  }

  /**
   * Stop vehicle hvac.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacStop(vin: string, accountId?: string): Observable<any> {
    const data = {
      type: 'HvacStart',
      attributes: { action: 'cancel' },
    };
    return this.perform('PERFORM_HVAC_START_URL', data, vin, accountId);
  }

  /**
   * Start vehicle charging.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeStart(vin: string, accountId?: string): Observable<any> {
    const data = {
      type: 'ChargingStart',
      attributes: { action: 'start' },
    };
    return this.perform('PERFORM_CHARGING_START_URL', data, vin, accountId);
  }

  /**
   * Stop vehicle charging.
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeStop(vin: string, accountId?: string): Observable<any> {
    const data = {
      type: 'ChargingStart',
      attributes: { action: 'stop' },
    };
    return this.perform('PERFORM_CHARGING_START_URL', data, vin, accountId);
  }

  /**
   * Start vehicle charging (Dacia Spring ONLY).
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeResume(vin: string, accountId?: string): Observable<any> {
    const data = {
      type: 'ChargingStart',
      attributes: { action: 'start' },
    };
    return this.perform('PERFORM_PAUSE_RESUME_URL', data, vin, accountId);
  }

  /**
   * Stop vehicle charging (Dacia Spring ONLY).
   * @param {string} vin - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargePause(vin: string, accountId?: string): Observable<any> {
    const data = {
      type: 'ChargingStart',
      attributes: { action: 'stop' },
    };
    return this.perform('PERFORM_PAUSE_RESUME_URL', data, vin, accountId);
  }

  /** @internal */
  private read<T>(apiUrl: ReadApiUrl, vin: string, accountId: string | undefined, params?: HttpParams): Observable<T> {
    const requiredAccountId: string = this.getAccountIdOrThrow(accountId);
    return this.httpClient
      .get<T>(KamereonApi[apiUrl](requiredAccountId, vin), { params });
  }

  /** @internal */
  private perform<T>(apiUrl: PerformApiUrl, data: any, vin: string, accountId: string | undefined): Observable<T> {
    const requiredAccountId: string = this.getAccountIdOrThrow(accountId);
    return this.httpClient
      .post<T>(KamereonApi[apiUrl](requiredAccountId, vin), { data });
  }

  /** @internal */
  private getAccountIdOrThrow(accountId?: string): string {
    return accountId || this.getFromSessionOrThrow('accountId');
  }

  /** @internal */
  private getPersonIdOrThrow(personId?: string): string {
    return personId || this.getFromSessionOrThrow('personId');
  }

  /** @internal */
  private getFromSessionOrThrow(key: keyof NgxRenaultSession): string {
    const value: Optional<string> = this.session[key];
    if (!value) emitError('KamereonException', `"${key}" is not defined or not stored in session.`);

    return value;
  }
}
