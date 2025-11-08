import { isBefore, isSameDay } from "date-fns";
import { Rate } from "src/rate/entities/rate.entity";

export function getRateByDate(rates: Rate[], date: string) {
  const ratesForDate = rates
    .filter(rate => {
      return isDateBeforeOrEqual(rate.dateFrom, date)
        && (isDateBeforeOrEqual(date, rate.dateTo) || !rate.dateTo);
    })
    .sort(sortRates);
  return ratesForDate.at(-1) || null;
}

export function sortRates(a: Rate, b: Rate) {
  const today = new Date();
  const aDateFrom = new Date(a.dateFrom);
  const aDateTo = a.dateTo ? new Date(a.dateTo) : today;
  const bDateFrom = new Date(b.dateFrom);
  const bDateTo = b.dateTo ? new Date(b.dateTo) : today;
  if (isBefore(aDateTo, bDateTo)) return -1;
  else if (isBefore(bDateTo, aDateTo)) return +1;
  else return Number(aDateFrom) - Number(bDateFrom);
}

export function isDateBeforeOrEqual(date: string | number | Date, dateToCompare: string | number | Date) {
  return isBefore(date, dateToCompare) || isSameDay(date, dateToCompare);
}