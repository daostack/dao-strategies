import { Page } from '@dao-strategies/core';
import { SharesRead, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, BoxExtendedProps, Spinner } from 'grommet';
import { FormNext, FormPrevious, StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { valueToString } from '../utils/general';
import { PagedTable, PageNumber, TableColumn } from './PagedTable';
import { IElement } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

interface Data {
  user: string;
  badge: boolean;
  info: string;
  reward?: string;
  percentage: string;
}

export interface RewardsTableI extends IElement {
  shares: SharesRead;
  showReward?: boolean;
  raised?: TokenBalance[];
  updatePage: (page: Page) => void;
}

export const FundersTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const shares = props.shares;
  return <>WIP</>;
};
