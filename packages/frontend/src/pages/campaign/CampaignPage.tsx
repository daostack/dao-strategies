import { Box, Header, Paragraph, Spinner, Tabs, Tab, Layer, Text } from 'grommet';
import { Refresh } from 'grommet-icons';
import { FC, useEffect, useState } from 'react';
import { ChainsDetails, TokenBalance } from '@dao-strategies/core';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import { AppButton, AppCallout } from '../../components/styles/BasicElements';
import { ColumnView, TwoColumns, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { ClaimButton } from '../../components/ClaimRewards';
import { AssetBalance } from '../../components/Assets';
import { truncate } from '../../utils/ethers';
import { CampaignGuardian } from '../../components/CampaignGuardian';
import { DateManager } from '../../utils/date.manager';
import { HEADER_HEIGHT } from '../AppHeader';
import { CampaignAreas, CampaignGrid } from './CampaignGrid';
import { theme } from '../../components/styles/themes';

export interface ICampaignPageProps {
  dum?: any;
}

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const [showFund, setShowFund] = useState<boolean>(false);

  const { isLoading, campaign, getShares, shares, getOtherDetails, otherDetails } = useCampaignContext();

  useEffect(() => {
    getShares();
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

  const assets = otherDetails && otherDetails.tokens ? otherDetails.tokens : [];

  const customAsset =
    otherDetails && otherDetails.tokens
      ? otherDetails.tokens.find((token) => token.address === campaign.customAssets[0])
      : undefined;

  const state = (
    <Box pad="medium">
      <AppCallout>
        {campaign.executed ? (
          <Text>Rewards succesfully computed on {new DateManager(campaign.execDate).toString()}!</Text>
        ) : (
          <>
            Campaign to be executed on {new DateManager(campaign.execDate).toString()}
            <Countdown to-date={campaign?.execDate}></Countdown>
          </>
        )}
      </AppCallout>
    </Box>
  );

  const details = (
    <>
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
    </>
  );

  const balances =
    otherDetails !== undefined ? (
      <Box direction="row">
        <Refresh onClick={() => getOtherDetails()}></Refresh>
        {otherDetails.tokens ? (
          otherDetails.tokens.map((token: TokenBalance) => {
            if (token.balance === '0' || campaign.customAssets.includes(token.address)) return <></>;
            return <AssetBalance asset={token}></AssetBalance>;
          })
        ) : (
          <></>
        )}
      </Box>
    ) : (
      <></>
    );

  const funds = (
    <Box direction="row" align="center" justify="center" style={{ marginBottom: '36px' }}>
      <Box style={{ border: 'solid 2px #ccc', borderRadius: '20px', padding: '20px 30px' }} direction="row">
        <Box>
          <Box direction="row" align="center">
            Campaign Funding (~{claimValue} usd)
            <AppButton onClick={() => setShowFund(true)}>Fund Campaign</AppButton>
          </Box>
          <Box direction="row" align="center">
            {balances}
          </Box>
        </Box>
        {customAsset ? (
          <Box>
            Custom token: {campaign.customAssets[0]} <AssetBalance asset={customAsset}></AssetBalance>
          </Box>
        ) : (
          <></>
        )}
        <Box>
          <Box direction="row" align="center">
            <ClaimButton campaignAddress={campaign.address}></ClaimButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const description = (
    <Box style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '36px' }}>
      <Paragraph>{campaign.description}</Paragraph>
    </Box>
  );

  const table = (
    <Tabs style={{ height: '500px', overflow: 'auto' }}>
      <Tab title={campaign.executed ? 'Final Rewards' : 'Leader Board'}>
        <RewardsTable rewards={shares} style={{ marginBottom: '36px' }}></RewardsTable>
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
  );

  const fund = <Box>fund</Box>;

  const info = <Box>info</Box>;

  return (
    <Box style={{ paddingTop: HEADER_HEIGHT }}>
      {showFund ? (
        <Layer onEsc={() => setShowFund(false)} onClickOutside={() => setShowFund(false)}>
          <FundCampaign
            onSuccess={() => {
              setShowFund(false);
              getOtherDetails();
            }}
            assets={assets}
            chainId={campaign.chainId}
            address={campaign.address}></FundCampaign>
        </Layer>
      ) : (
        <></>
      )}

      <CampaignGrid>
        <Box gridArea={CampaignAreas.state}>{state}</Box>
        <Box gridArea={CampaignAreas.details}>{details}</Box>
        <Box gridArea={CampaignAreas.funds}>{funds}</Box>
        <Box gridArea={CampaignAreas.description}>{description}</Box>
        <Box gridArea={CampaignAreas.table}>{table}</Box>
        <Box gridArea={CampaignAreas.fund}>{fund}</Box>
        <Box gridArea={CampaignAreas.info}>{info}</Box>
      </CampaignGrid>
    </Box>
  );
};
