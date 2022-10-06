import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Tip } from 'grommet';
import React, { useMemo } from 'react';
import { ReactElement } from 'react';
import { AppCard } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';
import { AssetsValue } from '../../components/Assets';

interface BalanceCardProps extends BoxExtendedProps {
  title: string;
  subtitle?: ReactElement;
  assets?: TokenBalance[];
  preferred?: string;
  action?: ReactElement;
}

export const BalanceCard = React.forwardRef<HTMLDivElement, BalanceCardProps>((props, ref) => {
  return (
    <AppCard ref={ref} align="center" style={{ ...props.style }}>
      <Box
        style={{
          textTransform: 'uppercase',
          fontWeight: '700',
          fontSize: styleConstants.textFontSizes.small,
          color: styleConstants.colors.ligthGrayText,
        }}>
        {props.title}
      </Box>
      {props.subtitle ? props.subtitle : <></>}

      <AssetsValue
        style={{ margin: '16px 0px 24px 0px' }}
        assets={props.assets}
        preferred={props.preferred}
        type="card"></AssetsValue>

      {props.action !== undefined ? props.action : <></>}
    </AppCard>
  );
});
