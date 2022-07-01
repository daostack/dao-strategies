import { Box } from 'grommet';
import { Asset } from '@dao-strategies/core';
import { IElement } from './styles/BasicElements';
import { FC } from 'react';

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
