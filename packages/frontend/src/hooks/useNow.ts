import { useEffect, useState } from 'react';

import { DateManager } from '../utils/time';

export const useNow = (): {
  now: DateManager | undefined;
} => {
  const [now, setNow] = useState<DateManager>();
  /**
   * Time management: frontend's time is syncronized with the oracle time.
   *
   * This means that the execDate, if campaign is retroactive, will be a time lower than the
   * local time on the oracle when registering (and executing) the campaign.
   */
  useEffect(() => {
    const _now = new DateManager();
    _now.sync().then(() => {
      setNow(_now);
    });
  }, []);

  return {
    now,
  };
};
