import { Box, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useNow } from '../hooks/useNow';
import { IElement } from './styles/BasicElements';

const DEBUG = false;

export interface CountdownI extends IElement {
  'to-date': number;
}

export const Countdown: FC<CountdownI> = (props: CountdownI) => {
  const [remaining, setRemaining] = useState<string>();
  const { now } = useNow();

  if (DEBUG) console.log('Countdown', { props, now });

  useEffect(() => {
    const getRem = () => {
      if (DEBUG) console.log('Countdown - Interval', { now });
      if (now !== undefined) {
        now.refresh();
        const rem = (props['to-date'] - now.getTime()).toString();
        if (DEBUG) console.log('Countdown - Interval - rem', { rem });
        setRemaining(rem);
      }
    };
    getRem();
    const interval = setInterval(getRem, 1000);
    return () => clearInterval(interval);
  }, [now, props]);

  const loading = now === undefined;

  return (
    <>
      <Box style={{ width: '100%', textAlign: 'center' }} justify="center" align="center" direction="row">
        {loading ? <Spinner></Spinner> : <Box>{remaining !== undefined ? remaining : ''}</Box>}
        {/* <Box pad="small">6</Box>:
        <Clock time={`PT${remaining}S`} run="backward" type="digital" /> */}
      </Box>
    </>
  );
};
