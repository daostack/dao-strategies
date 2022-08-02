import { SharesRead } from '@dao-strategies/core';
import { BigNumber } from 'ethers';
import { Box, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import { FC } from 'react';
import { IElement } from './styles/BasicElements';

interface Column {
  property: string;
  label: string;
}

interface Data {
  id: string;
  user: string;
  reward: string;
  badge: boolean;
  info: string;
}

const columns: Column[] = [
  { property: 'user', label: 'user' },
  { property: 'reward', label: 'reward' },
  { property: 'badge', label: 'verified' },
  { property: 'info', label: '' },
];

export interface RewardsTableI extends IElement {
  rewards?: SharesRead;
}

export const RewardsTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const data: Data[] =
    props === undefined || props.rewards === undefined
      ? []
      : Object.entries(props.rewards.shares).map(([address, reward]) => {
          const percentage = BigNumber.from(reward).mul(100).div(BigNumber.from('1000000000000000000')).toString();
          return {
            id: address,
            user: address,
            reward: `${percentage}%`,
            badge: true,
            info: '',
          };
        });

  return (
    <Box style={props.style}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.property}>
                <Text>{c.label}</Text>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((datum) => (
            <TableRow key={datum.id}>
              {columns.map((c) => (
                <TableCell key={c.property}>
                  <Text>{datum[c.property as keyof Data]}</Text>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
