import { CampaignReadDetails, ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner } from 'grommet';
import React from 'react';
import { Address } from './Address';
import { ChainTag } from './Assets';
import { AppCard, AppHeading, AppTag, FixedHeightPar } from './styles/BasicElements';

export interface ICampaignCard extends BoxExtendedProps {
  campaign?: CampaignReadDetails;
}

export const CampaignCard = React.forwardRef<HTMLDivElement, ICampaignCard>((props, ref) => {
  const campaign = props.campaign;

  if (!campaign) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  const chain = ChainsDetails.chainOfId(campaign.chainId);

  return (
    <AppCard {...props} ref={ref} style={{ ...props.style }}>
      <Box direction="row" align="center" justify="between">
        <AppHeading level="2" style={{ margin: '8px 0px 8px 0px' }}>
          {campaign.title}
        </AppHeading>
        <Box direction="row" align="center">
          <ChainTag style={{ marginRight: '12px' }} chain={chain}></ChainTag>{' '}
          <Address address={campaign.address} chainId={campaign.chainId}></Address>
        </Box>
      </Box>

      <Box direction="row" align="center" justify="between" style={{ margin: '8px 0px 8px 0px', fontWeight: 400 }}>
        <Box direction="row">
          Created by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.creatorId} chainId={campaign.chainId}></Address>
        </Box>
        <Box style={{ marginLeft: '16px' }} direction="row">
          Guarded by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.guardian} chainId={campaign.chainId}></Address>
        </Box>
      </Box>

      <Box style={{ marginTop: '12px' }} direction="row">
        <FixedHeightPar style={{ margin: '0px 16px 0px 0px' }} content={<>{campaign.description}</>}></FixedHeightPar>
        <AppTag style={{ flexShrink: 0 }}>~{campaign.valueLocked} USD</AppTag>
      </Box>
    </AppCard>
  );
});
