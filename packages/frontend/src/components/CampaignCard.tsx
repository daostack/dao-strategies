import { CampaignReadDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner } from 'grommet';
import { FC } from 'react';
import { Address } from './Address';
import { AppCard, AppTag, FixedHeightPar, IElement } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface ICampaignCard extends BoxExtendedProps {
  campaign?: CampaignReadDetails;
}

export const CampaignCard: FC<ICampaignCard> = (props: ICampaignCard) => {
  const campaign = props.campaign;

  if (!campaign) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  return (
    <AppCard {...props} style={{ ...props.style }}>
      <Box direction="row" align="center" justify="between">
        <Box style={{ fontSize: styleConstants.headingFontSizes[1], fontWeight: '700', margin: '8px 0px 8px 0px' }}>
          {campaign.title}
        </Box>{' '}
        <Box direction="row" align="center">
          Address: <Address address={campaign.address} chainId={campaign.chainId}></Address>
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
        <AppTag style={{ flexShrink: 0 }}>2000 DAI</AppTag>
      </Box>
    </AppCard>
  );
};
