import { CampaignReadDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner, Text, Image } from 'grommet';
import React from 'react';
import { useNowContext } from '../hooks/useNow';
import { valueToString } from '../utils/general';

import { AppCard, AppHeading, AppTag, CampaignIcon, FixedHeightPar } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface ICampaignCard extends BoxExtendedProps {
  campaign?: CampaignReadDetails;
}

export const CampaignCard = React.forwardRef<HTMLDivElement, ICampaignCard>((props, ref) => {
  const campaign = props.campaign as CampaignReadDetails;
  const { now } = useNowContext();

  if (!campaign) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }
  const getCampaignExecutionTime = () => {
    if (!now) return '';

    if (campaign.executed) {
      return `Campaign shares distributed ${now.prettyDiff(campaign.execDate)} ago`;
    } else {
      return `⏳ Due in ${now.prettyDiff(campaign.execDate)}`;
    }
  };

  return (
    <AppCard {...props} ref={ref} style={{ ...props.style }}>
      {/* Header with Logo and Campaigns Name */}
      <Box direction="row" align="start" margin={{ vertical: '0px' }}>
        <Box
          style={{ minWidth: '55px', position: 'relative', flexShrink: '0', marginRight: '16px' }}
          alignContent="start"
          align="start">
          <CampaignIcon src={campaign.logoUrl} iconSize="64px"></CampaignIcon>
          <Box
            justify="center"
            align="center"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              position: 'absolute',
              left: '-1px',
              top: '-1px',
              zIndex: 10,
            }}>
            <Image src="./images/Github.png" style={{ borderRadius: '50%' }} width="20px" height="20px"></Image>
          </Box>
        </Box>

        <Box>
          <AppHeading level={2} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {campaign.title}
          </AppHeading>

          <Text style={{ color: styleConstants.colors.lightGrayTextDarker, fontSize: '14px', lineHeight: '20px' }}>
            {getCampaignExecutionTime()}
          </Text>
        </Box>
      </Box>

      {/* Campaign Description and funds */}
      <Box style={{ marginTop: '6px' }}>
        {campaign.description && (
          <FixedHeightPar
            style={{ margin: '0px 16px 0px 0px', color: styleConstants.colors.lightGrayTextDarker, fontSize: '16px' }}
            content={<>{campaign.description}</>}></FixedHeightPar>
        )}
        {campaign.valueLocked !== undefined && campaign.valueLocked > 0 ? (
          <AppTag
            align="center"
            style={{
              fontFamily: 'Raleway',
              marginTop: '16px',
              color: styleConstants.colors.headingDark,
              fontWeight: '700',
              backgroundColor: styleConstants.colors.tagLightGray,
              width: 'fit-content',
            }}>
            ${valueToString(campaign.valueLocked, 0)} raised
          </AppTag>
        ) : (
          <></>
        )}
      </Box>
    </AppCard>
  );
});
