import { useEffect, useState } from 'react';

import { DateManager } from '../utils/date.manager';
import { useUserError } from './useErrorContext';

/** now is asynchronously synchronizing with the oracle clock at creation. */
export const useNow = (): {
  now: DateManager | undefined;
} => {
  const [now, setNow] = useState<DateManager>();
  const { showError } = useUserError();
  /**
   * Time management: frontend's time is syncronized with the oracle time.
   *
   * This means that the execDate, if campaign is retroactive, will be a time lower than the
   * local time on the oracle when registering (and executing) the campaign.
   */
  useEffect(() => {
    const _now = new DateManager();
    _now
      .sync()
      .then(() => {
        setNow(_now);
      })
      .catch((e) => {
        showError(`Error connecting to the oracle`);
      });
  }, []);

  return {
    now,
  };
};
