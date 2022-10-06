import { Box, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useNow } from '../hooks/useNow';
import { FieldLabel } from '../pages/create/field.label';
import { AppRemainingTime, IElement } from './styles/BasicElements';


const DEBUG = true;

export interface CountdownI extends IElement {
  'to-date': number;
  text?: string;
}

export const Countdown: FC<CountdownI> = (props: CountdownI) => {
  const [remaining, setRemaining] = useState<Duration | undefined>(undefined);
  const { now } = useNow();
  const execDate = new Date(props['to-date'] * 1000);

  if (DEBUG) console.log('Countdown', { props, now });


  useEffect(() => {
    const getRem = () => {
      if (DEBUG) console.log('Countdown - Interval', { now });
      if (!now) setRemaining(undefined);

      setRemaining(now?.intervalDuration(new Date(), execDate))
    };
    getRem();
    const interval = setInterval(getRem, 1000);
    return () => clearInterval(interval);
  }, [now, props]);

  const loading = now === undefined;

  return (
    <>
      <Box style={{ width: '100%', textAlign: 'start' }} justify="start" align="start" >
        {loading ? <Spinner></Spinner> : (<Box>

          {remaining !== undefined ? (
            <Box gap='10px' direction='row'>
              <FieldLabel label={props.text ?? ''} helpIconPosition={'left'} />
              <AppRemainingTime compactFormat={false} remainingTime={remaining} />
            </Box>
          ) : ''}
        </Box>)
        }

      </Box>
    </>
  );
};
