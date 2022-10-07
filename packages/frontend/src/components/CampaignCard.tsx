import { CampaignReadDetails, ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner, Text, Image } from 'grommet';
import React from 'react';
import { useNow } from '../hooks/useNow';
import { DateManager } from '../utils/date.manager';
import { valueToString } from '../utils/general';

import { AppCard, AppHeading, AppTag, CampaignIcon, FixedHeightPar } from './styles/BasicElements';

export interface ICampaignCard extends BoxExtendedProps {
  campaign?: CampaignReadDetails;
}

export const CampaignCard = React.forwardRef<HTMLDivElement, ICampaignCard>((props, ref) => {
  const campaign = props.campaign as CampaignReadDetails;
  const { now } = useNow();

  if (!campaign) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }
  const getCampaignExecutionTime = () => {
    if (!now) return ''

    if (campaign.executed) { return `Campaign shares distributed ${DateManager.intervalDuration(campaign.execDate, now?.getTime()).days} days ago` }
    else { return `⏳ Due in ${DateManager.intervalDuration(campaign.execDate, now?.getTime()).days} days` }
  }

  const chain = ChainsDetails.chainOfId(campaign.chainId);

  return (
    <AppCard {...props} ref={ref} style={{ ...props.style }}>
      {/* Header with Logo and Campaigns Name */}
      <Box direction="row" align="center" margin={{ vertical: '0px' }}>
        <Box style={{ minWidth: '55px' }} alignContent='start' align='start' >
          <CampaignIcon src={campaign.logoUrl || './images/welcome-bg-1.png'} iconSize='64px'  ></CampaignIcon>
          <Image src="./images/Github.png" style={{ borderRadius: '50%', position: 'relative', right: '14px', bottom: '70px', zIndex: 10 }} width="24px" height="24px"></Image>
        </Box>

        <Box style={{ position: 'relative', top: '-12px' }}>
          <FixedHeightPar content={<>{campaign.title}</>} style={{ fontFamily: 'Raleway', margin: '8px', fontSize: '24px', lineHeight: '22px' }}>

          </FixedHeightPar>
          {/* Campaign Execution time */}
          <Text style={{ marginTop: '-18px', marginLeft: '5px', color: '#575757', fontSize: '14px' }}>
            {getCampaignExecutionTime()}
          </Text>
        </Box>
      </Box>



      {/* Campaign Description and found */}
      <Box style={{ marginTop: '6px' }}>
        {campaign.description && (<FixedHeightPar style={{ margin: '0px 16px 0px 0px', color: '#575757', fontSize: '16px' }} content={<>{campaign.description}</>}></FixedHeightPar>)}
        <AppTag align='center' style={{ textAlign: 'center', minWidth: '150px', marginTop: '8px', color: '#0E0F19', fontWeight: '700', maxWidth: '180px' }}>$ {valueToString(campaign.valueLocked)} raised </AppTag>
      </Box>
    </AppCard>
  );
});
