import { Box } from 'grommet';
import { Asset, TokenBalance } from '@dao-strategies/core';
import { IElement } from './styles/BasicElements';
import { FC } from 'react';
import { formatEther } from '../utils/ethers';

interface IAsset extends IElement {
  asset?: Asset;
}

export const AssetIcon: FC<IAsset> = (props: IAsset) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box
      direction="row"
      style={{
        width: '120px',
        backgroundColor: '#ccc',
        borderRadius: '10px',
      }}>
      <Box style={{ textAlign: 'center', height: '40px', width: '40px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center' }}>{props.asset.name}</Box>
    </Box>
  );
};

interface IBalance extends IElement {
  asset?: TokenBalance;
}

export const AssetBalance: FC<IBalance> = (props: IBalance) => {
  if (props.asset === undefined) return <></>;
  return (
    <Box
      direction="column"
      style={{
        width: '120px',
        backgroundColor: '#ccc',
        borderRadius: '10px',
        marginLeft: '16px',
      }}>
      <Box style={{ textAlign: 'center', height: '40px', width: '40px' }}>
        <img src={props.asset.icon} alt={props.asset.name} />
      </Box>
      <Box style={{ textAlign: 'center' }}>{props.asset.name}</Box>
      <Box style={{ textAlign: 'center' }}>{formatEther(props.asset.balance)}</Box>
    </Box>
  );
};
