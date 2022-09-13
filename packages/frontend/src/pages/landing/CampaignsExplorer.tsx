import { Box, BoxExtendedProps, Text } from 'grommet';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { createImportSpecifier } from 'typescript';
import { CampaignCard } from '../../components/CampaignCard';
import { AppInput } from '../../components/styles/BasicElements';
import { ResponsiveGrid } from '../../components/styles/LayoutComponents.styled';

import { useCampaigns } from '../../hooks/useCampaigns';

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
    navigate(`/campaign/${address}`);
  };

  return (
    <Box style={{ padding: '16px 32px', ...props.style }}>
      <Box direction="row">
        <Box>Explore Campaigns</Box>
        <AppInput style={{ maxWidth: '350px' }} placeholder="search"></AppInput>
      </Box>

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
  );
};
