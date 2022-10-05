import { Box, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useNow } from '../hooks/useNow';
import { IElement } from './styles/BasicElements';
import { formatDuration, intervalToDuration } from 'date-fns'
import { DateManager } from '../utils/date.manager';
import { toDate } from 'date-fns/esm';

const DEBUG = true;

export interface CountdownI extends IElement {
  'to-date': number;
  children?: React.ReactNode;
}

export const Countdown: FC<CountdownI> = (props: CountdownI) => {
  const [remaining, setRemaining] = useState<Duration>();
  const { now } = useNow();
  const execDate = new Date(props['to-date'] * 1000);

  if (DEBUG) console.log('Countdown', { props, now });


  useEffect(() => {
    const getRem = () => {
      if (DEBUG) console.log('Countdown - Interval', { now });
      let duration = intervalToDuration({
        start: execDate,
        end: new Date(),
      })
      setRemaining(duration)
    };
    getRem();
    const interval = setInterval(getRem, 1000);
    return () => clearInterval(interval);
  }, [now, props]);

  const loading = now === undefined;

  return (
    <>
      <Box style={{ width: '100%', textAlign: 'start' }} justify="start" align="start" direction="column">
        {loading ? <Spinner></Spinner> : (<Box>

          {remaining !== undefined ? (
            <div style={{ flexDirection: 'column', gap: 'small' }}>
              {props.children}
              <div style={{ marginLeft: '8px', marginRight: '8px', display: 'inline-block' }}>
                <strong>{remaining.days}</strong> <span> days</span>
              </div>
              <div style={{ marginLeft: '8px', marginRight: '8px', display: 'inline-block' }}>
                <strong>{remaining.hours}</strong> <span> hours</span>
              </div>
              <div style={{ marginLeft: '8px', marginRight: '8px', display: 'inline-block' }}>
                <strong>{remaining.minutes}</strong> <span> minutes</span>
              </div>
              <div style={{ marginLeft: '8px', marginRight: '8px', display: 'inline-block' }}>
                <strong>{remaining.seconds}</strong> <span> seconds</span>
              </div>
            </div>
          ) : ''}
        </Box>)
        }

      </Box>
    </>
  );
};
