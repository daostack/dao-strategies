import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps } from 'grommet';
import { FC, ReactElement } from 'react';
import { AppCard } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';

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
    <AppCard align="center" style={{ ...props.style }}>
      <Box
        style={{
          textTransform: 'uppercase',
          fontWeight: '700',
          color: styleConstants.colors.ligthGrayText,
        }}>
        {props.title}
      </Box>
      <Box style={{ margin: '16px 0px 24px 0px', fontSize: '32px' }}>
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
