import { Box, BoxExtendedProps, Carousel, ResponsiveContext, Spinner } from 'grommet';
import React from 'react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../../hooks/useCampaigns';
import { RouteNames } from '../../pages/MainPage';
import { CampaignCard } from '../CampaignCard';
import { AppButton, AppCallout, AppHeading } from '../styles/BasicElements';
import { styleConstants } from '../styles/themes';

export const LandingCampaigns: FC<BoxExtendedProps> = (props: BoxExtendedProps) => {
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();

  const campaignClicked = (address: string) => {
    navigate(RouteNames.Campaign(address));
  };

  if (campaigns === undefined) {
    return (
      <Box>
        <Spinner></Spinner>
      </Box>
    );
  }

  return (
    <Box style={{ ...props.style }}>
      <AppHeading level={1} style={{ fontFamily: styleConstants.font.secondary }}>
        Recent Campaigns:
      </AppHeading>

      {/* Returns campaign cards on desktop and carousel with campaign cards on mobile */}
      <Box
        direction="row"
        style={{
          overflowX: 'scroll',
          maxWidth: '95vw',
        }}
        fill>
        {campaigns.map((campaign, ix) => {
          return (
            <CampaignCard
              compact
              key={ix}
              onClick={() => campaignClicked(campaign.address)}
              campaign={campaign}
              style={{
                float: 'left',
                margin: '10px 10px 20px 10px',
                flexShrink: '0',
                height: 'auto',
              }}></CampaignCard>
          );
        })}
      </Box>

      {/* Create new campaign box */}
      <Box direction="row" justify="center" style={{ marginTop: '4vw', gap: '20px' }}>
        <AppButton
          style={{ color: styleConstants.colors.primary }}
          onClick={() => navigate(RouteNames.Campaigns)}
          label="Explore All"
        />
        <AppButton primary onClick={() => navigate(RouteNames.Create)} label="Create New" />
      </Box>
    </Box>
  );
};
