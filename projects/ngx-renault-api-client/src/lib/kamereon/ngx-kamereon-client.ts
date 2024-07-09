import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionChargeMode, AdapterInfoData, BatteryStatusData, ChargeHistoryData, ChargeModeData, ChargeModeInputs, ChargeScheduleInputs, ChargesData, ChargingSettingsData, CockpitData, DateFilter, HvacHistoryData, HvacScheduleInputs, HvacSessionsData, HvacSettingsData, HvacStartInputs, HvacStatusData, KamereonApi, LockStatusData, NotificationSettingsData, PERIOD_TZ_FORMAT, Person, ResStateData, VehicleContract, VehicleDetails, VehicleLocationData, Vehicles } from '@remscodes/renault-api';
import { Observable } from 'rxjs';
import { emitError } from 'thror';
import { Optional } from '../models/shared.model';
import { NgxRenaultSession } from '../ngx-renault-session.service';
import { dateFilterToParams } from '../utils/date.utils';
import { KamereonHttpClient } from './http/kamereon.http-client';
import { KamereonMethod, PerformArgs, ReadArgs } from './models/kamereon-url.models';

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
   * @param {string?} [personId = the personId stored in the session] - The person id.
   */
  public getPerson(personId?: string): Observable<Person> {
    const requiredPersonId: string = this.getPersonIdOrThrow(personId, 'getPerson');
    return this.httpClient
      .get(KamereonApi.PERSON_URL(requiredPersonId));
  }

  /**
   * Get user vehicles.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getAccountVehicles(accountId?: string): Observable<Vehicles> {
    const requiredAccountId: string = this.getAccountIdOrThrow(accountId, 'getAccountVehicles');
    return this.httpClient
      .get(KamereonApi.ACCOUNT_VEHICLES_URL(requiredAccountId));
  }

  /**
   * Get user vehicle contracts.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getVehicleContracts(vin?: string, accountId?: string): Observable<VehicleContract[]> {
    return this.read({
      apiUrl: 'VEHICLE_CONTRACTS_URL',
      method: 'getVehicleContracts',
      accountId,
      vin,
      params: new HttpParams({
        fromObject: {
          locale: this.session.locale,
          brand: 'RENAULT',
          connectedServicesContracts: 'true',
          warranty: 'true',
          warrantyMaintenanceContracts: 'true',
        },
      }),
    });
  }

  /**
   * Get user vehicle details.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public getVehicleDetails(vin?: string, accountId?: string): Observable<VehicleDetails> {
    return this.read({
      apiUrl: 'VEHICLE_DETAILS_URL',
      method: 'getVehicleDetails',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle adapter info.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readAdapter(vin?: string, accountId?: string): Observable<AdapterInfoData> {
    return this.read({
      apiUrl: 'READ_ADAPTER_URL',
      method: 'readAdapter',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle battery status.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readBatteryStatus(vin?: string, accountId?: string): Observable<BatteryStatusData> {
    return this.read({
      apiUrl: 'READ_BATTERY_STATUS_URL',
      method: 'readBatteryStatus',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle charge history.
   * @param {DateFilter} filter - The date filter.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargeHistory(filter: DateFilter, vin?: string, accountId?: string): Observable<ChargeHistoryData> {
    return this.read({
      apiUrl: 'READ_CHARGE_HISTORY_URL',
      method: 'readChargeHistory',
      accountId,
      vin,
      params: dateFilterToParams(filter, this.session.locale),
    });
  }

  /**
   * Get vehicle charge mode.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargeMode(vin?: string, accountId?: string): Observable<ChargeModeData> {
    return this.read({
      apiUrl: 'READ_CHARGE_MODE_URL',
      method: 'readChargeMode',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle charges.
   * @param {Omit<DateFilter, 'period'>} filter - The date filter.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readCharges(filter: Omit<DateFilter, 'period'>, vin?: string, accountId?: string): Observable<ChargesData> {
    return this.read({
      apiUrl: 'READ_CHARGES_URL',
      method: 'readCharges',
      accountId,
      vin,
      params: dateFilterToParams(filter, this.session.locale),
    });
  }

  /**
   * Get vehicle charging settings.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readChargingSettings(vin?: string, accountId?: string): Observable<ChargingSettingsData> {
    return this.read({
      apiUrl: 'READ_CHARGING_SETTINGS_URL',
      method: 'readChargingSettings',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle cockpit.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readCockpit(vin?: string, accountId?: string): Observable<CockpitData> {
    return this.read({
      apiUrl: 'READ_COCKPIT_URL',
      method: 'readCockpit',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle hvac history.
   * @param {DateFilter} filter - The date filter.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacHistory(filter: DateFilter, vin?: string, accountId?: string): Observable<HvacHistoryData> {
    return this.read({
      apiUrl: 'READ_HVAC_HISTORY_URL',
      method: 'readHvacHistory',
      accountId,
      vin,
      params: dateFilterToParams(filter, this.session.locale),
    });
  }

  /**
   * Get vehicle hvac sessions.
   * @param {Omit<DateFilter, 'period'>} filter - The date filter.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacSessions(filter: Omit<DateFilter, 'period'>, vin?: string, accountId?: string): Observable<HvacSessionsData> {
    return this.read({
      apiUrl: 'READ_HVAC_SESSIONS_URL',
      method: 'readHvacSessions',
      accountId,
      vin,
      params: dateFilterToParams(filter, this.session.locale),
    });
  }

  /**
   * Get vehicle hvac status.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacStatus(vin?: string, accountId?: string): Observable<HvacStatusData> {
    return this.read({
      apiUrl: 'READ_HVAC_STATUS_URL',
      method: 'readHvacStatus',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle hvac settings.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readHvacSettings(vin?: string, accountId?: string): Observable<HvacSettingsData> {
    return this.read({
      apiUrl: 'READ_HVAC_SETTINGS_URL',
      method: 'readHvacSettings',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle location.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readLocation(vin?: string, accountId?: string): Observable<VehicleLocationData> {
    return this.read({
      apiUrl: 'READ_LOCATION_URL',
      method: 'readLocation',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle lock status.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readLockStatus(vin?: string, accountId?: string): Observable<LockStatusData> {
    return this.read({
      apiUrl: 'READ_LOCK_STATUS_URL',
      method: 'readLockStatus',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle notification settings.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readNotificationSettings(vin?: string, accountId?: string): Observable<NotificationSettingsData> {
    return this.read({
      apiUrl: 'READ_NOTIFICATION_SETTINGS_URL',
      method: 'readNotificationSettings',
      accountId,
      vin,
    });
  }

  /**
   * Get vehicle res state.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public readResState(vin?: string, accountId?: string): Observable<ResStateData> {
    return this.read({
      apiUrl: 'READ_RES_STATE_URL',
      method: 'readResState',
      accountId,
      vin,
    });
  }

  /**
   * Select vehicle charge mode.
   * @param {ChargeModeInputs} inputs - The charge mode inputs.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeMode(inputs: ChargeModeInputs, vin?: string, accountId?: string): Observable<ActionChargeMode> {
    const { action } = inputs;
    return this.perform({
      apiUrl: 'PERFORM_CHARGE_MODE_URL',
      method: 'performChargeMode',
      accountId,
      vin,
      data: {
        type: 'ChargeMode',
        attributes: { action },
      },
    });
  }

  /**
   * Set vehicle charge schedule.
   * @param {ChargeScheduleInputs} inputs - The charge schedules inputs.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeSchedule(inputs: ChargeScheduleInputs, vin?: string, accountId?: string): Observable<any> {
    const { schedules } = inputs;
    return this.perform({
      apiUrl: 'PERFORM_CHARGE_SCHEDULE_URL',
      method: 'performChargeSchedule',
      accountId,
      vin,
      data: {
        type: 'ChargeSchedule',
        attributes: { schedules },
      },
    });
  }

  /**
   * Set vehicle hvac schedule.
   * @param {HvacScheduleInputs} inputs - The hvac schedule inputs.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacSchedule(inputs: HvacScheduleInputs, vin?: string, accountId?: string): Observable<any> {
    const { schedules } = inputs;
    return this.perform({
      apiUrl: 'PERFORM_HVAC_SCHEDULE_URL',
      method: 'performHvacSchedule',
      accountId,
      vin,
      data: {
        type: 'HvacSchedule',
        attributes: { schedules },
      },
    });
  }

  /**
   * Start vehicle hvac.
   * @param {HvacStartInputs} inputs - The hvac inputs.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacStart(inputs: HvacStartInputs, vin?: string, accountId?: string): Observable<any> {
    const { targetTemperature, startDateTime } = inputs;
    const data: any = {
      type: 'HvacStart',
      attributes: { action: 'start', targetTemperature },
    };
    if (startDateTime) data.attributes.startDateTime = formatDate(startDateTime, PERIOD_TZ_FORMAT, this.session.locale);
    return this.perform({
      apiUrl: 'PERFORM_HVAC_START_URL',
      method: 'performHvacStart',
      accountId,
      vin,
      data,
    });
  }

  /**
   * Stop vehicle hvac.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performHvacStop(vin?: string, accountId?: string): Observable<any> {
    return this.perform({
      apiUrl: 'PERFORM_HVAC_START_URL',
      method: 'performHvacStop',
      accountId,
      vin,
      data: {
        type: 'HvacStart',
        attributes: { action: 'cancel' },
      },
    });
  }

  /**
   * Start vehicle charging.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeStart(vin?: string, accountId?: string): Observable<any> {
    return this.perform({
      apiUrl: 'PERFORM_CHARGING_START_URL',
      method: 'performChargeStart',
      accountId,
      vin,
      data: {
        type: 'ChargingStart',
        attributes: { action: 'start' },
      },
    });
  }

  /**
   * Stop vehicle charging.
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeStop(vin?: string, accountId?: string): Observable<any> {
    return this.perform({
      apiUrl: 'PERFORM_CHARGING_START_URL',
      method: 'performChargeStop',
      accountId,
      vin,
      data: {
        type: 'ChargingStart',
        attributes: { action: 'stop' },
      },
    });
  }

  /**
   * Start vehicle charging (Dacia Spring ONLY).
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargeResume(vin?: string, accountId?: string): Observable<any> {
    return this.perform({
      apiUrl: 'PERFORM_PAUSE_RESUME_URL',
      method: 'performChargeResume',
      accountId,
      vin,
      data: {
        type: 'ChargingStart',
        attributes: { action: 'start' },
      },
    });
  }

  /**
   * Stop vehicle charging (Dacia Spring ONLY).
   * @param {string?} [vin = the vin stored in the session] - The vehicle vin.
   * @param {string?} [accountId = the accountId stored in the session] - The account id.
   */
  public performChargePause(vin?: string, accountId?: string): Observable<any> {
    return this.perform({
      apiUrl: 'PERFORM_PAUSE_RESUME_URL',
      method: 'performChargePause',
      accountId,
      vin,
      data: {
        type: 'ChargingStart',
        attributes: { action: 'stop' },
      },
    });
  }

  /** @internal */
  private read<T>(args: ReadArgs): Observable<T> {
    const { apiUrl, method, accountId, vin, params } = args;

    const requiredAccountId: string = this.getAccountIdOrThrow(accountId, method);
    const requiredVin: string = this.getVinOrThrow(vin, method);
    return this.httpClient
      .get<T>(KamereonApi[apiUrl](requiredAccountId, requiredVin), { params });
  }

  /** @internal */
  private perform<T>(args: PerformArgs): Observable<T> {
    const { apiUrl, method, accountId, vin, data } = args;

    const requiredAccountId: string = this.getAccountIdOrThrow(accountId, method);
    const requiredVin: string = this.getVinOrThrow(vin, method);
    return this.httpClient
      .post<T>(KamereonApi[apiUrl](requiredAccountId, requiredVin), { data });
  }

  /** @internal */
  private getPersonIdOrThrow(personId: Optional<string>, method: KamereonMethod): string {
    return personId || this.getFromSessionOrThrow('personId', method);
  }

  /** @internal */
  private getAccountIdOrThrow(accountId: Optional<string>, method: KamereonMethod): string {
    return accountId || this.getFromSessionOrThrow('accountId', method);
  }

  /** @internal */
  private getVinOrThrow(vin: Optional<string>, method: KamereonMethod): string {
    return vin || this.getFromSessionOrThrow('vin', method);
  }

  /** @internal */
  private getFromSessionOrThrow(key: keyof NgxRenaultSession, method: KamereonMethod): string {
    const value: Optional<string> = this.session[key];
    if (!value) emitError('KamereonException', `Cannot ${method} because "${key}" is falsy or not stored in session.`);

    return value;
  }
}
