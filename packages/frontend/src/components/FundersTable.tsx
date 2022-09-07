import { CampaignFundersRead, campaignInstance, Page } from '@dao-strategies/core';
import { parseEther } from 'ethers/lib/utils';
import { Box, Spinner } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { Address } from './Address';
import { PagedTable, TableColumn } from './PagedTable';
import { IElement } from './styles/BasicElements';

export interface FundersTableI extends IElement {
  funders?: CampaignFundersRead;
  updatePage: (page: Page) => void;
}

export const FundersTable: FC<FundersTableI> = (props: FundersTableI) => {
  const { campaign } = useCampaignContext();
  const funders = props.funders;
  const widths = ['60%', '40%'];

  if (funders === undefined) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  const data: any[] = funders.funders.map((funder) => {
    return [funder.value, funder.funder];
  });

  const columns: TableColumn[] = [
    { title: 'amount', width: widths[0], align: 'start' },
    { title: 'address', width: widths[1], align: 'start' },
  ];

  if (!campaign) {
    return <></>;
  }

  const row = (rowIx: number, colIx: number) => {
    if (rowIx >= data.length) {
      return <></>;
    }
    const datum = {
      amount: data[rowIx][0],
      address: data[rowIx][1],
    };

    switch (colIx) {
      case 0:
        return <>{datum.amount}</>;

      case 1:
        return <Address chainId={campaign.chainId} address={datum.address}></Address>;

      default:
        throw new Error(`Col ix ${colIx} out of bounds`);
    }
  };

  return <PagedTable page={funders.page} columns={columns} rows={row} updatePage={props.updatePage}></PagedTable>;
};
