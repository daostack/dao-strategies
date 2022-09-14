import { Page } from '@dao-strategies/core';
import { SharesRead, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, Spinner } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { valueToString } from '../utils/general';
import { PagedTable, TableColumn } from './PagedTable';
import { IElement } from './styles/BasicElements';

export interface RewardsTableI extends IElement {
  shares: SharesRead;
  showReward?: boolean;
  raised?: TokenBalance[];
  updatePage: (page: Page) => void;
}

export const RewardsTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const shares = props.shares;
  const showReward = props.showReward !== undefined ? props.showReward : false;
  const widths = showReward ? ['40%', '20%', '40%'] : ['60%', '40%'];

  if (shares === undefined) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  const data: any[] = Object.entries(shares.shares).map(([address, share]) => {
    const ratio = +ethers.utils.formatEther(share);

    let reward: string | undefined;

    if (showReward && props.raised) {
      const raisedWithPrice = props.raised.filter((token) => token.price !== undefined);
      const rewardUSD = raisedWithPrice
        .map((token) => {
          const raised = +ethers.utils.formatUnits(token.balance, token.decimals) * (token.price as number);
          return raised * ratio;
        })
        .reduce((total, reward) => total + reward, 0);

      const raisedCustom = props.raised.filter((token) => token.price === undefined);

      let hasCustom = false;

      const customStr = raisedCustom
        .map((token) => {
          const raised = +ethers.utils.formatUnits(token.balance, token.decimals);
          if (raised > 0) {
            hasCustom = true;
          }
          return `${valueToString(raised * ratio, 2)} ${token.name}`;
        })
        .reduce((total, reward) => total.concat(' ' + reward), '');

      reward = `${rewardUSD > 0 ? `~$${valueToString(rewardUSD, 2)}` : '-'}${hasCustom ? ` + ${customStr}` : ''}`;
    }

    return [address, valueToString(ratio * 100, 1), reward, true, ''];
  });

  const columns: TableColumn[] = [
    { title: 'user handle', width: widths[0], align: 'start' },
    { title: 'score (%)', width: widths[1] },
    { title: 'reward', width: widths[2] },
  ];

  const row = (rowIx: number, colIx: number) => {
    if (rowIx >= data.length) {
      return <></>;
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
            @{datum.user}
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

  return <PagedTable page={shares.page} columns={columns} rows={row} updatePage={props.updatePage}></PagedTable>;
};
