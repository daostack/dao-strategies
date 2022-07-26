import { Box, Text } from 'grommet';
import { Search } from 'grommet-icons';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { CampaignCard } from '../../components/CampaignCard';
import { AppInput } from '../../components/styles/BasicElements';
import { ResponsiveGrid } from '../../components/styles/LayoutComponents.styled';

import { useCampaigns } from '../../hooks/useCampaigns';

export interface ICampaignsExplorerProps {
  dum?: any;
}

export const CampaignsExplorer: FC<ICampaignsExplorerProps> = (props: ICampaignsExplorerProps) => {
  const { campaigns } = useCampaigns();

  return (
    <Box style={{ height: '100vh', width: '100vw', padding: '16px 32px' }}>
      <Box direction="row" style={{ maxWidth: '600px' }}>
        <Text size="xlarge">Explore Campaigns</Text>
        <AppInput placeholder="search"></AppInput>
      </Box>

      <ResponsiveGrid gap="small" pad={{ vertical: '30px' }}>
        {campaigns ? (
          campaigns.map((campaign) => {
            return (
              <Link key={campaign.address} to={`/campaign/${campaign.address}`}>
                <CampaignCard campaign={campaign}></CampaignCard>
              </Link>
            );
          })
        ) : (
          <></>
        )}
      </ResponsiveGrid>
    </Box>
  );
};
