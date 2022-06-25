import { Box, Clock, Header, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { IElement } from './styles/BasicElements';

export interface CountdownI extends IElement {
  'to-date': number;
}

export const Countdown: FC<CountdownI> = (props: CountdownI) => {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    setRemaining(0);
  }, [props]);

  return (
    <>
      <Box style={{ width: '100%', textAlign: 'center' }} pad="large" justify="center" align="center" direction="row">
        <Box pad="small">6</Box>:
        <Clock time={`PT${remaining}S`} run="backward" type="digital" />
      </Box>
    </>
  );
};
