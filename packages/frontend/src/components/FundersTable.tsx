import { CampaignFundersRead, campaignInstance, Page } from '@dao-strategies/core';
import { Box, Spinner } from 'grommet';
import { FC } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { valueToString } from '../utils/general';
import { Address } from './Address';
import { PagedTable, TableColumn } from './PagedTable';
import { IElement } from './styles/BasicElements';

export interface FundersTableI extends IElement {
  funders?: CampaignFundersRead;
  updatePage: (page: Page) => void;
  invert?: boolean;
  perPage: number; // needed to render the "loading" table of the correct size even if "shares" is undefined
}

export const FundersTable: FC<FundersTableI> = (props: FundersTableI) => {
  const { campaign } = useCampaignContext();
  const funders = props.funders;
  const widths = ['60%', '40%'];

  if (funders === undefined) {
    return <PagedTable loading perPage={props.perPage}></PagedTable>;
  }

  const data: any[] = funders.funders.map((funder) => {
    return [funder.value, funder.funder];
  });

  const columns: TableColumn[] = [
    { title: 'amount (usd)', width: widths[0], align: 'start' },
    { title: 'address', width: widths[1], align: 'start' },
  ];

  if (!campaign) {
    return <></>;
  }

  const row = (rowIx: number, colIx: number) => {
    if (rowIx >= data.length) {
      return <>-</>;
    }
    const datum = {
      amount: valueToString(data[rowIx][0], 2),
      address: data[rowIx][1],
    };

    switch (colIx) {
      case 0:
        return <>~${datum.amount}</>;

      case 1:
        return <Address chainId={campaign.chainId} address={datum.address}></Address>;

      default:
        throw new Error(`Col ix ${colIx} out of bounds`);
    }
  };

  return (
    <PagedTable
      invert={props.invert}
      style={{ ...props.style }}
      page={funders.page}
      columns={columns}
      rows={row}
      updatePage={props.updatePage}></PagedTable>
  );
};
