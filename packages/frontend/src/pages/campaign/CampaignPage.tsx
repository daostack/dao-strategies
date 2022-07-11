import { Box, Header, Paragraph, Spinner, Tabs, Tab, Layer } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import { AppButton } from '../../components/styles/BasicElements';
import { ColumnView, TwoColumns, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaign } from '../../hooks/useCampaign';
import { AppHeader } from '../AppHeader';
import { FundCampaign } from '../../components/FundCampaign';
import { formatEther } from '../../utils/ethers';
import { useLoggedUser } from '../../hooks/useLoggedUser';

export interface ICampaignPageProps {
  dum?: any;
}

type RouteParams = {
  campaignAddress: string;
};

enum UserClaimStatus {
  loggedOff = 'loggedOff',
  canClaim = 'canClaim',
  notExecuted = 'notExecuted',
}

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const params = useParams<RouteParams>();
  const [showFund, setShowFund] = useState<boolean>(false);

  const { isLoading, campaign, getRewards, rewards, getOtherDetails, otherDetails } = useCampaign(
    params.campaignAddress
  );

  const { user, connect } = useLoggedUser();

  useEffect(() => {
    getRewards();
    getOtherDetails();
    /** we want to react when campaign is loaded only */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  if (campaign === undefined || isLoading)
    return (
      <ViewportContainer>
        please wait...
        <br></br>
        <Spinner />
      </ViewportContainer>
    );

  const balances =
    otherDetails !== undefined ? (
      <Box direction="row">
        {' '}
        {Object.keys(otherDetails.tokens).map((key: any) => {
          const token = otherDetails.tokens[key];

          if (token.balance === '0') return <></>;

          return (
            <Box
              direction="column"
              style={{
                width: '120px',
                backgroundColor: '#ccc',
                borderRadius: '10px',
                marginLeft: '16px',
              }}>
              <Box style={{ textAlign: 'center', height: '40px', width: '40px' }}>
                <img src={(token as any).icon} alt={(token as any).name} />
              </Box>
              <Box style={{ textAlign: 'center' }}>{(token as any).name}</Box>
              <Box style={{ textAlign: 'center' }}>{formatEther(token.balance)}</Box>
            </Box>
          );
        })}
      </Box>
    ) : (
      <></>
    );

  let claimStatus = UserClaimStatus.loggedOff;

  if (user === undefined) {
    claimStatus = UserClaimStatus.loggedOff;
  } else {
    if (!campaign.executed) {
      claimStatus = UserClaimStatus.notExecuted;
    }
  }

  const claimButton = (claimStatus: UserClaimStatus) => {
    switch (claimStatus) {
      case UserClaimStatus.loggedOff:
        return (
          <>
            <AppButton onClick={() => connect()}>Connect</AppButton>
          </>
        );

      case UserClaimStatus.canClaim:
        return (
          <>
            My Reward <AppButton>Claim rewards</AppButton>
          </>
        );

      case UserClaimStatus.notExecuted:
        return <>Not executed</>;
    }
  };

  return (
    <>
      {showFund ? (
        <Layer onEsc={() => setShowFund(false)} onClickOutside={() => setShowFund(false)}>
          <FundCampaign
            onSuccess={() => {
              setShowFund(false);
              getOtherDetails();
            }}
            asset={campaign.asset}
            chainId={campaign.chainId}
            address={campaign.address}></FundCampaign>
        </Layer>
      ) : (
        <></>
      )}
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
                Campaign Funding
                <AppButton onClick={() => setShowFund(true)}>Fund Campaign</AppButton>
              </Box>
              <Box direction="row" align="center">
                {balances}
              </Box>
            </>
            <>
              <Box direction="row" align="center">
                {claimButton(claimStatus)}
              </Box>
            </>
          </TwoColumns>
        </Box>

        <Box style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '36px' }}>
          <Paragraph>{campaign.description}</Paragraph>
        </Box>

        <Tabs style={{ height: '500px', overflow: 'auto' }}>
          <Tab title="Leader Board">
            <RewardsTable rewards={rewards} style={{ marginBottom: '36px' }}></RewardsTable>
          </Tab>
          <Tab title="More Info">
            <TwoColumns>
              <Box>
                <Box>
                  <Paragraph>Guardian</Paragraph>
                  <Paragraph>{campaign.guardian}</Paragraph>
                </Box>
                <Box>
                  <Paragraph>Address</Paragraph>
                  <Paragraph>{campaign.address}</Paragraph>
                </Box>
                <Box>
                  <Paragraph>Asset</Paragraph>
                  <Paragraph>TBD</Paragraph>
                </Box>
              </Box>

              <Box>
                <Box>
                  <Paragraph>Repositories</Paragraph>
                  {campaign.strategyParams.repositories.map((repo: { owner: string; repo: string }) => {
                    return (
                      <Paragraph>
                        {repo.owner}/{repo.repo}
                      </Paragraph>
                    );
                  })}
                </Box>
              </Box>
            </TwoColumns>
          </Tab>
        </Tabs>
      </ColumnView>
    </>
  );
};
