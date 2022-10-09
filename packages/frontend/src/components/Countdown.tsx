import { Box, BoxExtendedProps } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useNowContext } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';
import { AppRemainingTime } from './styles/BasicElements';

const DEBUG = true;

export interface CountdownI extends BoxExtendedProps {
  toDate: number;
  text?: string;
}

export const Countdown: FC<CountdownI> = (props: CountdownI) => {
  const [remaining, setRemaining] = useState<Duration | undefined>(undefined);
  const { now } = useNowContext();
  const execDate = new DateManager(props.toDate);

  if (DEBUG) console.log('Countdown', { props, now });

  useEffect(() => {
    const getRem = () => {
      if (DEBUG) console.log('Countdown - Interval', { now });
      if (!now) {
        setRemaining(undefined);
      } else {
        const duration = DateManager.intervalDuration(now.getTimeDynamic(), execDate.getTime());
        if (DEBUG) console.log('duration: ', { duration });
        setRemaining(duration);
      }
    };

    getRem();
    const interval = setInterval(getRem, 1000);
    return () => clearInterval(interval);
  }, [now, props]);

  return (
    <>
      <Box style={{ textAlign: 'start', ...props.style }} justify="start" align="start">
        {remaining !== undefined ? <AppRemainingTime compactFormat={false} remainingTime={remaining} /> : <></>}
      </Box>
    </>
  );
};
