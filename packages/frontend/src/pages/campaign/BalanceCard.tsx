import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { FC, ReactElement } from 'react';

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
    <Box
      {...props}
      style={{
        ...props.style,
        backgroundColor: '#FBFDFC',
        border: 'solid 1px  #F0EDED',
        padding: '16px 24px',
        borderRadius: '8px',
        minWidth: '280px',
        minHeight: '122px',
      }}>
      <Box style={{ textTransform: 'uppercase' }}>{props.title}</Box>
      <Box>
        {props.symbol}
        {props.value}
        {props.coin}
      </Box>
      {props.assets !== undefined ? props.assets.map((asset) => <img src={asset.icon} alt={asset.name} />) : <></>}
      {props.action !== undefined ? props.action : <></>}
    </Box>
  );
};
