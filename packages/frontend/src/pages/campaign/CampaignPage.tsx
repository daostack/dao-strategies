import { Box, Header, Paragraph, Spinner } from 'grommet';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import { AppButton } from '../../components/styles/BasicElements';
import { ColumnView, TwoColumns } from '../../components/styles/LayoutComponents.styled';
import { useCampaign } from '../../hooks/useCampaign';
import { AppHeader } from '../AppHeader';

export interface ICampaignPageProps {
  dum?: any;
}

type RouteParams = {
  campaignAddress: string;
};

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const params = useParams<RouteParams>();
  const { isLoading, campaign, getRewards, rewards } = useCampaign(params.campaignAddress);

  useEffect(() => {
    getRewards();
  }, [getRewards]);

  if (campaign === undefined || isLoading) return <Spinner />;
  return (
    <>
      <AppHeader></AppHeader>
      <ColumnView>
        <Countdown to-date={campaign?.execDate}></Countdown>
        <Box direction="row" align="center" justify="center">
          <Box
            style={{
              backgroundColor: '#ccc',
              height: '80px',
              width: '80px',
              borderRadius: '40px',
              marginRight: '20px',
            }}></Box>
          <Box>
            <Header>{campaign.title}</Header>
          </Box>
        </Box>

        <Box direction="row" align="center" justify="center" style={{ marginBottom: '36px' }}>
          Created by: {(campaign as any).creatorId}
        </Box>

        <Box direction="row" align="center" justify="center" style={{ marginBottom: '36px' }}>
          <TwoColumns style={{ border: 'solid 2px #ccc', borderRadius: '20px', padding: '20px 30px' }}>
            <>
              <Box direction="row" align="center">
                Campaign Funding <AppButton>Fund Campaign</AppButton>
              </Box>
            </>
            <>
              <Box direction="row" align="center">
                My Reward <AppButton>Claim rewards</AppButton>
              </Box>
            </>
          </TwoColumns>
        </Box>

        <Box>
          <Paragraph>{campaign.description}</Paragraph>
        </Box>

        <RewardsTable rewards={rewards}></RewardsTable>
      </ColumnView>
    </>
  );
};
