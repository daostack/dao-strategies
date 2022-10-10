import { Strategy } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Image } from 'grommet';
import { FC } from 'react';
import { SelectValue } from '../../components/styles/BasicElements';

interface IStrategySelector extends BoxExtendedProps {
  strategy: Strategy;
}

export const StrategySelector: FC<IStrategySelector> = (props: IStrategySelector) => {
  return (
    <SelectValue>
      <Box style={{ height: '32px', width: '32px', marginRight: '8px' }}>
        {props.strategy.info.icon ? <Image src={props.strategy.info.icon}></Image> : <></>}
      </Box>
      <Box>{props.strategy.info.name}</Box>
    </SelectValue>
  );
};
