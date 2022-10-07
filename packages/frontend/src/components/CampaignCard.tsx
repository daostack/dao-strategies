import { CampaignReadDetails, ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner, Text, Image } from 'grommet';
import React from 'react';

import { AppCard, AppHeading, AppTag, CampaignIcon, FixedHeightPar } from './styles/BasicElements';

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
      <Box direction="row" align="center" >
        {/* <CampaignIcon iconSize='14px' src={campaign.logoUrl} /> */}
        <Box pad={{ horizontal: 'small' }}>
          <CampaignIcon src="./images/welcome-bg-1.png" iconSize='64px'  ></CampaignIcon>
          <Image src="./images/Github.png" style={{ borderRadius: '50%', position: 'relative', right: '3px', bottom: '70px', zIndex: 10 }} width="24px" height="24px"></Image>
        </Box>

        <AppHeading level="2" style={{ margin: '8px', position: 'relative', top: '-25px', }}>
          {campaign.title}
        </AppHeading>

        <Box>
          <Text>{campaign.description ? campaign.description : ''}</Text>
        </Box>
      </Box>

      <Box style={{ marginTop: '12px' }} direction="row">
        <FixedHeightPar style={{ margin: '0px 16px 0px 0px' }} content={<>{campaign.description}</>}></FixedHeightPar>
        <AppTag style={{ flexShrink: 0 }}>$ {campaign.valueLocked ?? 2499} </AppTag>
      </Box>
    </AppCard>
  );
});
