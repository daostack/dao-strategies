import { Box, BoxExtendedProps, Spinner } from 'grommet';
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

  const campaignClicked = (address: string) => {
    navigate(RouteNames.Campaign(address));
  };

  return (
    <Box style={{ ...props.style }}>
      <AppHeading level={1} style={{ fontFamily: styleConstants.font.secondary }}>
        Recent Campaigns:
      </AppHeading>
      <div style={{ padding: '0vw 0vw 0vw 0vw' }}>
        {!isLoading && campaigns !== undefined ? (
          campaigns.length > 0 ? (
            campaigns.map((campaign, ix) => {
              return (
                <CampaignCard
                  key={campaign.address}
                  onClick={() => campaignClicked(campaign.address)}
                  compact
                  campaign={campaign}
                  style={{ float: 'left', margin: '1vw 1vw 1vw 0vw' }}></CampaignCard>
              );
            })
          ) : (
            <AppCallout>No Campaigns Found</AppCallout>
          )
        ) : (
          <Spinner></Spinner>
        )}
      </div>
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
