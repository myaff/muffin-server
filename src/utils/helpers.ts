import { isBefore, isSameDay } from 'date-fns';
import { RateVersion } from 'src/rate/entities/rate-version.entity';

export function getRateByDate(rates: RateVersion[], date: string) {
  const ratesForDate = rates
    .filter(rate => {
      return isDateBeforeOrEqual(rate.startDate, date)
        && (!rate.endDate || isDateBeforeOrEqual(date, rate.endDate));
    })
    .sort(sortRates);
  return ratesForDate.at(-1) || null;
}

export function sortRates(a: RateVersion, b: RateVersion) {
  const today = new Date();
  const aDateFrom = new Date(a.startDate);
  const aDateTo = a.endDate ? new Date(a.endDate) : today;
  const bDateFrom = new Date(b.startDate);
  const bDateTo = b.endDate ? new Date(b.endDate) : today;
  if (isBefore(aDateTo, bDateTo)) return -1;
  else if (isBefore(bDateTo, aDateTo)) return +1;
  else return Number(aDateFrom) - Number(bDateFrom);
}

export function isDateBeforeOrEqual(date: string | number | Date, dateToCompare: string | number | Date) {
  return isBefore(date, dateToCompare) || isSameDay(date, dateToCompare);
}
