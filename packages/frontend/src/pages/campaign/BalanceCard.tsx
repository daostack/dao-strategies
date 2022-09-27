import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Tip } from 'grommet';
import React, { useMemo } from 'react';
import { ReactElement } from 'react';
import { AssetBalance } from '../../components/Assets';
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
      <Tip
        content={
          <Box style={{ width: '300px', padding: '16px 16px 0px 16px' }}>
            {props.assets ? (
              props.assets.map((asset) => {
                return asset.balance !== '0' ? (
                  <AssetBalance style={{ marginBottom: '16px' }} asset={asset}></AssetBalance>
                ) : (
                  <></>
                );
              })
            ) : (
              <></>
            )}
          </Box>
        }>
        <AssetsValue
          style={{ margin: '16px 0px 24px 0px' }}
          assets={props.assets}
          preferred={props.preferred}
          type="card"></AssetsValue>
      </Tip>
      {props.action !== undefined ? props.action : <></>}
    </AppCard>
  );
});
