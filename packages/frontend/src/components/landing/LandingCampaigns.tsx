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
  const { campaigns, isLoading } = useCampaigns();
  const navigate = useNavigate();
  const size = React.useContext(ResponsiveContext);

  const campaignClicked = (address: string) => {
    navigate(RouteNames.Campaign(address));
  };

  const returnCampaignCards = () => {
    if (isLoading) return <Spinner></Spinner>;
    if (!campaigns || campaigns.length === 0) return <AppCallout>No Campaigns Found</AppCallout>;

    const exploreCampaignCards = (extraStyling?: React.CSSProperties, compact: boolean = true): any => {
      return campaigns.map((campaign, ix) => {
        return (
          <CampaignCard
            key={campaign.address}
            onClick={() => campaignClicked(campaign.address)}
            compact={compact}
            campaign={campaign}
            style={{ float: 'left', margin: '1vw 1vw 1vw 0vw', ...extraStyling }}></CampaignCard>
        );
      });
    };
    const campaignsOnMobile = (
      <>
        <Box
          direction="row"
          className="hide-scrollbar-chrome hide-scrollbar-firefox"
          style={{
            padding: '0',
            scrollbarWidth: 'none',
            overflowX: 'scroll',
            justifyItems: 'center',
            alignItems: 'center',
            maxWidth: '95vw',
          }}
          fill>
          {exploreCampaignCards({ flexShrink: '0', width: '100vw', height: 'auto' }, false)}
        </Box>
      </>
    );
    return (
      <div
        style={{
          padding: '0',
        }}>
        {size.includes('small') ? <>{campaignsOnMobile}</> : <>{exploreCampaignCards()}</>}
      </div>
    );
  };

  return (
    <Box style={{ ...props.style }}>
      <AppHeading level={1} style={{ fontFamily: styleConstants.font.secondary }}>
        Recent Campaigns:
      </AppHeading>

      {/* Returns campaign cards on desktop and carousel with campaign cards on mobile */}
      {returnCampaignCards()}

      {/* Create new campaign box */}
      <Box direction="row" justify="center" style={{ marginTop: '4vw' }}>
        <Box style={{ marginTop: '20px' }}>
          <AppButton
            style={{ color: styleConstants.colors.primary, padding: '14px 80px' }}
            onClick={() => navigate(RouteNames.Create)}
            label="Create New Campaign"
          />
        </Box>
      </Box>
    </Box>
  );
};
