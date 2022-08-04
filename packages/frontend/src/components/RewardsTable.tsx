import { SharesRead } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { Box, Spinner, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { IElement } from './styles/BasicElements';

interface Data {
  id: string;
  user: string;
  badge: boolean;
  info: string;
  reward: string;
  percentage: string;
}

export interface RewardsTableI extends IElement {
  shares?: SharesRead;
}

export const RewardsTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const { shares: _shares } = useCampaignContext();

  const shares = props.shares ? props.shares : _shares;

  if (shares === undefined) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  const data: Data[] = Object.entries(shares.shares).map(([address, share]) => {
    const percentage = BigNumber.from(share).mul(100).div(BigNumber.from('1000000000000000000')).toString();
    return {
      id: address,
      user: address,
      percentage,
      reward: '200 USD',
      badge: true,
      info: '',
    };
  });

  return (
    <Box style={{ width: '100%', ...props.style }}>
      <Box
        direction="row"
        style={{
          width: '100%',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '26px',
          padding: '10px 36px',
        }}>
        <Box style={{ width: '50%' }}>user handle</Box>
        <Box direction="row" justify="center" style={{ width: '25%' }}>
          score
        </Box>
        <Box direction="row" justify="center" style={{ width: '25%' }}>
          reward
        </Box>
      </Box>
      <Box direction="column" style={{ width: '100%' }}>
        {data.map((datum) => (
          <Box
            fill
            direction="row"
            align="center"
            key={datum.id}
            style={{
              border: '1px solid',
              borderColor: '#F0EDED',
              borderRadius: '20px',
              height: '40px',
              marginBottom: '16px',
              padding: '10px 36px',
              backgroundImage: 'white',
            }}>
            <Box direction="row" align="center" style={{ width: '50%' }}>
              @{datum.user}
              {datum.badge ? <StatusGood style={{ marginLeft: '6px' }} color="#5762D5"></StatusGood> : <></>}
            </Box>
            <Box direction="row" justify="center" style={{ width: '25%' }}>
              {datum.percentage}
            </Box>
            <Box direction="row" justify="center" style={{ width: '25%' }}>
              {datum.reward}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
