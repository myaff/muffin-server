import { Tracking } from '../entities/tracking.entity';

export interface TrackingDayDto {
  date: string;
  tracking: ReturnType<Tracking['toPlainObject']>[];
  total: number;
}

export interface TrackingCalendarDto {
  [key: string]: TrackingDayDto;
}


export class TrackingCalendar {
  days: { [key: string]: TrackingDayDto};

  constructor(list: Tracking[]) {
    this.days = list.reduce((acc, item) => {
      const day = acc[item.date];
      if (day) {
        day.total += item.amount;
        day.tracking.push(item.toPlainObject());
      } else {
        acc[item.date] = {
          date: item.date,
          total: item.amount,
          tracking: [item.toPlainObject()],
        };
      }
      return acc;
    }, {} as TrackingCalendarDto);
  }

  toPlainObject(): object {
    return this.days;
  }
}
