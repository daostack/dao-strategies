import { Page } from '@dao-strategies/core';
import { SharesRead, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, Spinner } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC, ReactNode } from 'react';
import { valueToString } from '../utils/general';
import { PagedTable, TableColumn } from './PagedTable';
import { AppTip, IElement } from './styles/BasicElements';
import { AssetsValue } from './Assets';
import { styleConstants } from './styles/themes';
import { VerifiedIcon } from './VerifiedIcon';
import { Address } from './Address';

export interface RewardsTableI extends IElement {
  shares?: SharesRead;
  chainId?: number;
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
  const chainId = props.chainId;

  if (shares === undefined) {
    return (
      <PagedTable
        loading
        perPage={props.perPage}
        loadingMsg={
          <>
            Computing shares. Please hold, <br />
            this may take up to a few minutes.
          </>
        }></PagedTable>
    );
  }

  const data: any[] = Object.entries(shares.shares).map(([username, share]) => {
    const ratio = +ethers.utils.formatEther(share.amount);

    let reward: ReactNode | undefined;

    if (showReward && props.raised) {
      reward = <AssetsValue title="Reward" assets={props.raised} ratio={ratio} type="inline"></AssetsValue>;
    }

    return [username, valueToString(ratio * 100, 1), reward, share.address, ''];
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
      address: data[rowIx][3],
      info: data[rowIx][4],
    };

    switch (colIx) {
      case 0:
        return (
          <>
            @{datum.user.split(':')[1]}
            {datum.address !== undefined ? (
              <AppTip
                dropContent={
                  <Box style={{ padding: '12px 20px' }}>
                    <Address chainId={chainId} address={datum.address}></Address>
                  </Box>
                }>
                <VerifiedIcon style={{ marginLeft: '6px' }} color={styleConstants.colors.links}></VerifiedIcon>
              </AppTip>
            ) : (
              <></>
            )}
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
      invert={props.invert}
      page={shares.page}
      columns={columns}
      rows={row}
      updatePage={props.updatePage}></PagedTable>
  );
};
