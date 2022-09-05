import { TimeDetails } from '@dao-strategies/core';
import add from 'date-fns/add';
import { ORACLE_NODE_URL } from '../config/appConfig';

/** time wrapper to handle time-related operations (works in seconds and not ms, synchronized
 * with backend's time) */
export class DateManager {
  private date: Date;
  /** difference between frontend and backend time */
  private bias: number = 0;

  /** input date is in seconds if provided */
  constructor(date?: Date | number) {
    this.date = date ? (typeof date === 'number' ? new Date(date * 1000) : date) : new Date();
  }

  async sync() {
    const time = await fetch(ORACLE_NODE_URL + '/time/now', {
      method: 'get',
      credentials: 'include',
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        throw new Error(`Error getting oracle time`);
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

  /** updates to the latest device date (keeping the bias) */
  refresh(): void {
    this.date = new Date();
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

  prettyDiff(to: number) {
    // TODO
    const diff = Math.abs(this.getTime() - to);
    if (diff < 60) {
      return diff + ' sec';
    } else if (diff < 60 * 60) {
      return Math.ceil(diff / 60) + ' min';
    } else if (diff < 60 * 60 * 24) {
      return Math.ceil(diff / (60 * 60)) + ' hr';
    } else {
      return Math.ceil(diff / (60 * 60 * 24)) + ' days';
    }
  }

  toString(): string {
    return this.date.toUTCString();
  }
}
