import { Page } from '@dao-strategies/core';
import { SharesRead, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, Spinner } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC, ReactNode } from 'react';
import { valueToString } from '../utils/general';
import { PagedTable, TableColumn } from './PagedTable';
import { IElement } from './styles/BasicElements';
import { AssetsValue } from './Assets';
import { styleConstants } from './styles/themes';

export interface RewardsTableI extends IElement {
  shares?: SharesRead;
  showReward?: boolean;
  raised?: TokenBalance[];
  updatePage: (page: Page) => void;
  invert?: boolean;
  perPage: number; // needed to render the "loading" table of the correct size even if "shares" is undefined
}

export const RewardsTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const shares = props.shares;
  const showReward = props.showReward !== undefined ? props.showReward : false;
  const widths = showReward ? ['40%', '20%', '40%'] : ['60%', '40%'];

  if (shares === undefined) {
    return <PagedTable loading perPage={props.perPage}></PagedTable>;
  }

  const data: any[] = Object.entries(shares.shares).map(([address, share]) => {
    const ratio = +ethers.utils.formatEther(share);

    let reward: ReactNode | undefined;

    if (showReward && props.raised) {
      reward = <AssetsValue assets={props.raised} ratio={ratio} type="inline"></AssetsValue>;
    }

    return [address, valueToString(ratio * 100, 1), reward, true, ''];
  });

  const columns: TableColumn[] = [
    { title: 'user handle', width: widths[0], align: 'start' },
    {
      title: (
        <span>
          shares (<span style={{ fontWeight: 'normal' }}>/100</span>)
        </span>
      ),
      width: widths[1],
    },
  ];

  if (showReward) {
    columns.push({ title: 'reward', width: widths[2] });
  }

  const row = (rowIx: number, colIx: number) => {
    if (rowIx >= data.length) {
      return <Box style={{ color: styleConstants.colors.ligthGrayText }}>-</Box>;
    }
    const datum = {
      user: data[rowIx][0],
      percentage: data[rowIx][1],
      reward: data[rowIx][2],
      badge: data[rowIx][3],
      info: data[rowIx][4],
    };

    switch (colIx) {
      case 0:
        return (
          <>
            @{datum.user.split(':')[1]}
            {datum.badge ? <StatusGood style={{ marginLeft: '6px' }} color="#5762D5"></StatusGood> : <></>}
          </>
        );

      case 1:
        return <>{datum.percentage}</>;

      case 2:
        return <>{datum.reward}</>;

      default:
        throw new Error(`Col ix ${colIx} out of bounds`);
    }
  };

  return (
    <PagedTable
      loading={shares === undefined}
      invert={props.invert}
      page={shares.page}
      columns={columns}
      rows={row}
      updatePage={props.updatePage}></PagedTable>
  );
};
