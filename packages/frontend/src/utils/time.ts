import { TimeDetails } from '@dao-strategies/core';
import add from 'date-fns/add';
import { ORACLE_NODE_URL } from '../config/appConfig';

/** time wrapper to handle time-related operations (works in seconds and not ms, synchronized
 * with backend's time) */
export class DateManager {
  private date: Date;
  /** difference between frontend and backend time */
  private bias: number = 0;

  constructor(date?: Date) {
    this.date = date ? date : new Date();
  }

  async sync() {
    const time = await fetch(ORACLE_NODE_URL + '/time/now', {
      method: 'get',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .then((time): TimeDetails => time);

    this.bias = time.now - this.getTime();
  }

  getBias(): number {
    return this.bias;
  }

  clone(): DateManager {
    return new DateManager(new Date(this.date));
  }

  getTime(): number {
    return Math.floor(this.date.getTime() / 1000) + this.bias;
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
