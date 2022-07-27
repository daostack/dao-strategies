import { Box, Header, Paragraph, Spinner, Tabs, Tab, Layer, Text } from 'grommet';
import { FC, useEffect, useState } from 'react';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import { AppButton } from '../../components/styles/BasicElements';
import { ColumnView, TwoColumns, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { ClaimButton } from '../../components/ClaimRewards';
import { AssetBalance } from '../../components/Assets';
import { Refresh } from 'grommet-icons';
import { truncate } from '../../utils/ethers';
import { ChainsDetails, TokenBalance } from '@dao-strategies/core';
import { CampaignGuardian } from '../../components/CampaignGuardian';
import { DateManager } from '../../utils/date.manager';

export interface ICampaignPageProps {
  dum?: any;
}

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const [showFund, setShowFund] = useState<boolean>(false);

  const { isLoading, campaign, getRewards, rewards, getOtherDetails, otherDetails } = useCampaignContext();

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

  const claimValue =
    otherDetails && otherDetails.tokens ? truncate(ChainsDetails.valueOfAssets(otherDetails.tokens).toString(), 2) : 0;

  const balances =
    otherDetails !== undefined ? (
      <Box direction="row">
        <Refresh onClick={() => getOtherDetails()}></Refresh>
        {otherDetails.tokens.map((token: TokenBalance) => {
          if (token.balance === '0') return <></>;
          return <AssetBalance asset={token}></AssetBalance>;
        })}
      </Box>
    ) : (
      <></>
    );

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
      <ColumnView>
        <Box pad="medium">
          {campaign.executed ? (
            <Text>Rewards succesfully computed on {new DateManager(campaign.execDate).toString()}!</Text>
          ) : (
            <>
              Campaign to be executed on {new DateManager(campaign.execDate).toString()}
              <Countdown to-date={campaign?.execDate}></Countdown>
            </>
          )}
        </Box>
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

        <Box align="center" justify="center" pad="medium">
          <Box>Created by: {campaign.creatorId}</Box>
          <Box>Guarded by: {campaign.guardian}</Box>
        </Box>

        <Box direction="row" align="center" justify="center" style={{ marginBottom: '36px' }}>
          <TwoColumns style={{ border: 'solid 2px #ccc', borderRadius: '20px', padding: '20px 30px' }}>
            <>
              <Box direction="row" align="center">
                Campaign Funding (~{claimValue} usd)
                <AppButton onClick={() => setShowFund(true)}>Fund Campaign</AppButton>
              </Box>
              <Box direction="row" align="center">
                {balances}
              </Box>
            </>
            <>
              <Box direction="row" align="center">
                <ClaimButton campaignAddress={campaign.address}></ClaimButton>
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
          <Tab title="Guardian">
            <CampaignGuardian campaignAddress={campaign.address}></CampaignGuardian>
          </Tab>
        </Tabs>
      </ColumnView>
    </>
  );
};
