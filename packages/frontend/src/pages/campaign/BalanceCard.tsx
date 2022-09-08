import { TokenBalance } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Tip } from 'grommet';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { AppCard } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';

interface BalanceCardProps extends BoxExtendedProps {
  title: string;
  subtitle?: ReactElement;
  value: string;
  symbol?: string;
  coin?: string;
  assets?: TokenBalance[];
  action?: ReactElement;
}

type Timeout = ReturnType<typeof setTimeout>;

export const BalanceCard: FC<BalanceCardProps> = (props: BalanceCardProps) => {
  const [show, setShow] = useState<boolean>(false);

  WIP;

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
      {props.subtitle ? props.subtitle : <></>}
      <Tip content={<Box>Assets: {props.assets?.map((asset) => asset.name)}</Box>}>
        <Box
          style={{
            margin: '16px 0px 24px 0px',
            fontSize: '32px',
            borderBottom: '2px dashed',
            borderColor: styleConstants.colors.lightGrayBorder,
            paddingBottom: '4px',
          }}>
          {props.value !== '0' ? (
            <>
              {props.symbol} {props.value} {props.coin}
            </>
          ) : (
            '--'
          )}
        </Box>
      </Tip>
      {props.assets !== undefined ? props.assets.map((asset) => <img src={asset.icon} alt={asset.name} />) : <></>}
      {props.action !== undefined ? props.action : <></>}
    </AppCard>
  );
};
