import { Box, BoxExtendedProps } from 'grommet';
import { Asset, TokenBalance } from '@dao-strategies/core';
import { IElement } from './styles/BasicElements';
import { FC } from 'react';
import { assetValue, formatEther } from '../utils/ethers';
import { styleConstants } from './styles/themes';

interface IAsset extends IElement {
  asset?: Asset;
}

export const AssetIcon: FC<IAsset> = (props: IAsset) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box
      direction="row"
      align="center"
      justify="center"
      style={{
        height: '40px',
        width: '96px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        border: 'solid 1px',
        borderColor: styleConstants.colors.lightGrayBorder,
      }}>
      <Box style={{ textAlign: 'center', height: '20px', width: '20px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center' }}>{props.asset.name}</Box>
    </Box>
  );
};

interface IBalance extends BoxExtendedProps {
  asset?: TokenBalance;
}

export const AssetBalance: FC<IBalance> = (props: IBalance) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box direction="row" style={{ width: '100%', ...props.style }} justify="between">
      <Box direction="row" align="center">
        <Box style={{ textAlign: 'center', height: '30px', width: '30px' }}>
          <img src={props.asset.icon} alt={props.asset.name} />
        </Box>
        <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{formatEther(props.asset.balance)}</Box>
        <Box style={{ textAlign: 'center', marginLeft: '8px' }}>{props.asset.name}</Box>
      </Box>

      <Box>~{assetValue(props.asset, 2)}</Box>
    </Box>
  );
};
