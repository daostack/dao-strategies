import { TimeDetails } from '@dao-strategies/core';
import add from 'date-fns/add';
import intervalToDuration from 'date-fns/intervalToDuration';
import { ORACLE_NODE_URL } from '../config/appConfig';

/** time wrapper to handle time-related operations (works in seconds and not ms, synchronized
 * with backend's time) */
export class DateManager {
  private date: Date;
  /** difference between frontend and backend time */
  private bias: number = 0;
  private localTimeZero: number;

  /** input date is in seconds if provided */
  constructor(date?: DateManager | Date | number | string, utc: boolean = false) {
    this.localTimeZero = Date.now() / 1000;
    if (typeof date === 'number') {
      this.date = new Date(date * 1000);
    } else if (typeof date === 'string') {
      if (utc) {
        /**
         * the string is interpreted as UTC in the UX, but the Date constructure interprets it as local string.
         * So we need to shift the local time offset.
         */
        this.date = new Date(date);
        // temp.getTimezoneOffset();
        // this.date = new Date(temp.getTime() - temp.getTimezoneOffset() * 60 * 1000);
      } else {
        this.date = new Date(date);
      }
    } else if (date instanceof Date) {
      this.date = date;
    } else if (date instanceof Date) {
      this.date = date;
    } else {
      this.date = new Date();
    }
  }

  static from(date?: DateManager | Date | number | string, utc: boolean = false): DateManager {
    const datem = new DateManager(date, utc);
    return datem;
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

  /** get's time in seconds (includes the bias) */
  getTime(): number {
    return Math.floor(this.date.getTime() / 1000) + this.bias;
  }

  /* Returns the dynamic time. Similar to Date.now() but in seconds and including the bias. */
  getTimeDynamic(): number {
    return this.getTime() + Date.now() / 1000 - this.localTimeZero;
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

  static intervalDuration(startDate: number, endDate: number): Duration {
    return intervalToDuration({
      start: startDate * 1000,
      end: endDate * 1000,
    });
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
