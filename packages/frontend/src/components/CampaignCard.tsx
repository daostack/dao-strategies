import { CampaignReadDetails, ChainsDetails } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Spinner, Text, Image } from 'grommet';
import React from 'react';
import { useNowContext } from '../hooks/useNow';
import { valueToString } from '../utils/general';

import { AppCard, AppHeading, AppTag, CampaignIcon, FixedHeightPar } from './styles/BasicElements';
import { styleConstants } from './styles/themes';

export interface ICampaignCard extends BoxExtendedProps {
  campaign?: CampaignReadDetails;
  compact?: boolean;
}

export const CampaignCard = React.forwardRef<HTMLDivElement, ICampaignCard>((props, ref) => {
  const campaign = props.campaign;
  const { now } = useNowContext();

  const chain = campaign ? ChainsDetails.chainOfId(campaign.chainId) : undefined;

  const compact = props.compact !== undefined ? props.compact : false;

  const getCampaignExecutionTime = () => {
    if (!now) return '';
    if (!campaign) return '';

    if (campaign.executed) {
      return `Campaign shares distributed ${now.prettyDiff(campaign.execDate)} ago`;
    } else {
      return `⏳ Due in ${now.prettyDiff(campaign.execDate)}`;
    }
  };

  return (
    <AppCard
      {...props}
      ref={ref}
      style={{
        width: compact ? '320px' : 'auto',
        height: compact ? '100px' : 'auto',
        position: 'relative',
        ...props.style,
      }}>
      {/* Header with Logo and Campaigns Name */}
      {campaign ? (
        <>
          <Box direction="row" align="start" style={{ margin: '0px' }}>
            <Box
              style={{
                minWidth: compact ? '40px' : '55px',
                position: 'relative',
                flexShrink: '0',
                marginRight: '16px',
              }}
              alignContent="start"
              align="start">
              <CampaignIcon src={campaign.logoUrl} iconSize={compact ? '40px' : '64px'}></CampaignIcon>
              <Box
                justify="center"
                align="center"
                style={{
                  width: compact ? '18px' : '24px',
                  height: compact ? '18px' : '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  left: '-1px',
                  top: '-1px',
                  zIndex: 10,
                }}>
                <Image
                  src="./images/Github.png"
                  style={{ borderRadius: '50%' }}
                  width={compact ? '14px' : '20px'}
                  height={compact ? '14px' : '20px'}></Image>
              </Box>
            </Box>

            <Box>
              <AppHeading level={2} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {campaign.title}
              </AppHeading>

              {!compact ? (
                <Text
                  style={{ color: styleConstants.colors.lightGrayTextDarker, fontSize: '14px', lineHeight: '20px' }}>
                  {getCampaignExecutionTime()}
                </Text>
              ) : (
                <></>
              )}
            </Box>
          </Box>

          {/* Campaign Description and funds */}
          <Box style={{ marginTop: '6px' }}>
            {!compact && campaign.description && (
              <FixedHeightPar
                style={{
                  margin: '0px 16px 0px 0px',
                  color: styleConstants.colors.lightGrayTextDarker,
                  fontSize: '16px',
                }}
                content={<>{campaign.description}</>}></FixedHeightPar>
            )}
            {campaign.valueLocked !== undefined && campaign.valueLocked > 0 ? (
              <AppTag
                align="center"
                style={{
                  fontFamily: styleConstants.font.secondary,
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

          {chain ? (
            <Box>
              <Box
                style={{
                  height: compact ? '18px' : '24px',
                  width: compact ? '18px' : '24px',
                  position: 'absolute',
                  right: compact ? '18px' : '24px',
                  bottom: compact ? '18px' : '24px',
                }}>
                <img style={{ height: '100%', width: '100%' }} src={chain.chainIcon} alt={chain.chain.name} />
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Box fill justify="center" align="center">
          <Spinner></Spinner>
        </Box>
      )}
    </AppCard>
  );
});
