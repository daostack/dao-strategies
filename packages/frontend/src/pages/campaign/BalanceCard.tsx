import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { FC, ReactElement } from 'react';
import { AppCard } from '../../components/styles/BasicElements';

interface BalanceCardProps extends BoxExtendedProps {
  title: string;
  value: string;
  symbol?: string;
  coin?: string;
  assets?: TokenBalance[];
  action?: ReactElement;
}

export const BalanceCard: FC<BalanceCardProps> = (props: BalanceCardProps) => {
  return (
    <AppCard>
      <Box style={{ textTransform: 'uppercase', fontWeight: '700' }}>{props.title}</Box>
      <Box>
        {props.value !== '0' ? (
          <>
            {props.symbol} {props.value} {props.coin}
          </>
        ) : (
          '--'
        )}
      </Box>
      {props.assets !== undefined ? props.assets.map((asset) => <img src={asset.icon} alt={asset.name} />) : <></>}
      {props.action !== undefined ? props.action : <></>}
    </AppCard>
  );
};
