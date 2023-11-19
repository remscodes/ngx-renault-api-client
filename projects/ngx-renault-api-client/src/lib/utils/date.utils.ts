import { HttpParams } from '@angular/common/http';
import { DateFilter, DateType, Period, PERIOD_FORMATS } from '@remscodes/renault-api';
import dayjs from 'dayjs';
import { PartialBy } from '../models/shared.model';

export function dateFilterToParams({ start, end, period }: PartialBy<DateFilter, 'period'>, locale: string): HttpParams {
  let params: HttpParams = new HttpParams({
    fromObject: {
      start: normalizeDate(start, locale, period),
      end: normalizeDate(end, locale, period),
    },
  });

  if (period) params = params.set('type', period);

  return params;
}

export function normalizeDate(date: DateType, locale: string, period: Period = 'day'): string {
  return formatDate(date, PERIOD_FORMATS[period], locale);
}

export function formatDate(date: DateType, format: string, locale: string): string {
  return dayjs(date, { format, locale }).toString();
}
