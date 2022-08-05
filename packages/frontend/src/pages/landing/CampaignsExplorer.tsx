import { Box, Text } from 'grommet';
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

  const columns = {
    small: ['auto'],
    medium: ['auto', 'auto'],
    large: ['auto', 'auto', 'auto'],
    xlarge: ['auto', 'auto', 'auto'],
  };

  const rows = {
    small: ['auto'],
    medium: ['auto'],
    large: ['auto'],
    xlarge: ['auto'],
  };

  return (
    <Box style={{ padding: '16px 32px' }}>
      <Box direction="row" style={{ maxWidth: '600px' }}>
        <Text size="xlarge">Explore Campaigns</Text>
        <AppInput placeholder="search"></AppInput>
      </Box>

      <ResponsiveGrid columnsAt={columns} rowsAt={rows} gap="small" pad={{ vertical: '30px' }}>
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
