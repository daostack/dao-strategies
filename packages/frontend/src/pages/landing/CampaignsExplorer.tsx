import { Box, BoxExtendedProps, Text } from 'grommet';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignCard } from '../../components/CampaignCard';
import { AppInput } from '../../components/styles/BasicElements';
import { ResponsiveGrid, ViewportContainer } from '../../components/styles/LayoutComponents.styled';

import { useCampaigns } from '../../hooks/useCampaigns';
import { HEADER_HEIGHT, MAX_WIDTH } from '../AppHeader';
import { RouteNames } from '../MainPage';

export interface ICampaignsExplorerProps extends BoxExtendedProps {
  dum?: any;
}

export const CampaignsExplorer: FC<ICampaignsExplorerProps> = (props: ICampaignsExplorerProps) => {
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();

  const columns = {
    small: ['1fr'],
    medium: ['1fr', '1fr'],
    large: ['1fr', '1fr', '1fr'],
    xlarge: ['1fr', '1fr', '1fr'],
  };

  const rows = {
    small: ['auto'],
    medium: ['auto'],
    large: ['auto'],
    xlarge: ['auto'],
  };

  const campaignClicked = (address: string) => {
    console.log('clicked', { address });
    navigate(RouteNames.Campaign(address));
  };

  return (
    <ViewportContainer>
      <Box fill style={{ padding: '16px 32px', marginTop: HEADER_HEIGHT, maxWidth: MAX_WIDTH, ...props.style }}>
        {/* <Box direction="row" style={{}}>
          <Box>Explore Campaigns</Box>
          <AppInput style={{ maxWidth: '350px' }} placeholder="search"></AppInput>
        </Box> */}

        <ResponsiveGrid columnsAt={columns} rowsAt={rows} gap="small" pad={{ vertical: '30px' }}>
          {campaigns ? (
            campaigns.map((campaign) => {
              console.log({ campaignClicked });
              return (
                <CampaignCard
                  onClick={() => campaignClicked(campaign.address)}
                  key={campaign.address}
                  campaign={campaign}></CampaignCard>
              );
            })
          ) : (
            <></>
          )}
        </ResponsiveGrid>
      </Box>
    </ViewportContainer>
  );
};
