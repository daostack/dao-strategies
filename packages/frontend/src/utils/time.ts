import add from 'date-fns/add';

/** time wrapper to handle time-related operations (in seconds and not ms)*/
export class DateManager {
  private date: Date;

  constructor(date?: Date) {
    this.date = date ? date : new Date();
  }

  clone(): DateManager {
    return new DateManager(new Date(this.date));
  }

  getTime(): number {
    return Math.floor(this.date.getTime() / 1000);
  }

  addMonths(n: number): DateManager {
    this.date = add(this.date, { months: n });
    return this;
  }

  addDays(n: number): DateManager {
    this.date = add(this.date, { days: n });
    return this;
  }

  setTimeOfDay(time: string): DateManager {
    const str = this.date.toUTCString();
    const newDate = str.substring(0, 10) + time;
    this.date = new Date(newDate);
    return this;
  }
}
