export const REPOSITORY = 'RATE_REPOSITORY';

export enum RateType {
  HOURLY = 'hourly',
  RECURRING = 'recurring',
  FIXED = 'fixed',
}

export enum RateRecurringUnit {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum RateScope {
  USER = 'user',
  CLIENT = 'client',
  PROJECT = 'project',
}