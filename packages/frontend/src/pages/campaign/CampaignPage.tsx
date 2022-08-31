import { ethers } from 'ethers';
import { Box, Spinner, Text, Heading, GridSizeType } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { ChainsDetails, Page } from '@dao-strategies/core';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import {
  AppCallout,
  AppCard,
  AppTag,
  ExpansibleCard,
  ExpansiveParagraph,
  InfoProperty,
} from '../../components/styles/BasicElements';
import {
  Breakpoint,
  ResponsiveGrid,
  TwoColumns,
  ViewportContainer,
} from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { truncate } from '../../utils/ethers';
import { CampaignGuardian } from '../../components/CampaignGuardian';
import { DateManager } from '../../utils/date.manager';
import { HEADER_HEIGHT } from '../AppHeader';
import { CampaignAreas, CampaignGrid } from './CampaignGrid';
import { Address } from '../../components/Address';
import { BalanceCard } from './BalanceCard';
import { ClaimButton } from '../../components/ClaimRewards';
import { styleConstants } from '../../components/styles/themes';

export interface ICampaignPageProps {
  dum?: any;
}

const HEADING_SIZE = '24px';

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const [showFund, setShowFund] = useState<boolean>(true);

  const { isLoading, campaign, getShares, shares, getOtherDetails, otherDetails } = useCampaignContext();

  const updatePage = (page: Page) => {
    getShares(page);
  };

  useEffect(() => {
    getShares({ number: 0, perPage: 10 });
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

  const valueLocked =
    otherDetails && otherDetails.balances
      ? truncate(ChainsDetails.valueOfAssets(otherDetails.balances).toString(), 2)
      : '0';

  const assets = otherDetails && otherDetails.balances ? otherDetails.balances : [];

  const customAsset =
    otherDetails && otherDetails.balances
      ? otherDetails.balances.find((token) => token.address === campaign.customAssets[0])
      : undefined;

  const details = (
    <AppCard style={{ paddingBottom: '18px' }}>
      <Box direction="row" align="center" justify="start" style={{ marginBottom: '16px' }}>
        <Box
          style={{
            backgroundColor: '#ccc',
            height: '80px',
            width: '80px',
            borderRadius: '40px',
            marginRight: '20px',
          }}></Box>
        <Box>
          <Heading size="small">{campaign.title}</Heading>
        </Box>
      </Box>

      <Box style={{ fontSize: styleConstants.textFontSizes[1] }}>
        {campaign.executed ? (
          <Box>Rewards succesfully computed on {new DateManager(campaign.execDate).toString()}!</Box>
        ) : (
          <>
            Campaign to be executed on {new DateManager(campaign.execDate).toString()}
            <Countdown to-date={campaign?.execDate}></Countdown>
          </>
        )}
      </Box>

      <Box direction="row" align="center" justify="start" style={{ marginTop: '16px', fontWeight: 400 }}>
        <Box direction="row">
          Created by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.creatorId} chainId={campaign.chainId}></Address>
        </Box>
        <Box style={{ marginLeft: '16px' }} direction="row">
          Guarded by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.guardian} chainId={campaign.chainId}></Address>
        </Box>
      </Box>

      <Box style={{ marginBottom: '36px' }}>
        <ExpansiveParagraph maxHeight={200}>{campaign.description}</ExpansiveParagraph>
      </Box>
    </AppCard>
  );

  const info = (
    <ExpansibleCard
      style={{ marginTop: '16px' }}
      padding={[24, 24, 36, 24]}
      hiddenPart={
        <TwoColumns align="start" justify="start" style={{ marginTop: '40px' }}>
          <Box>
            <InfoProperty title="Github Repositories">
              {campaign.strategyParams.repositories.map((repo: any) => (
                <AppTag>{`${repo.owner}/${repo.repo}`}</AppTag>
              ))}
            </InfoProperty>
            <InfoProperty style={{ marginTop: '36px' }} title="Guardian Address">
              <Address address={campaign.guardian} chainId={campaign.chainId}></Address>
            </InfoProperty>
          </Box>
          <Box>
            <InfoProperty title="Contribution Period">
              <Box>Start date: {campaign.strategyParams.timeRange.start}</Box>
              <Box>End date: {campaign.strategyParams.timeRange.end}</Box>
            </InfoProperty>
            <InfoProperty style={{ marginTop: '36px' }} title="Campaign address">
              <Address address={campaign.address} chainId={campaign.chainId}></Address>
            </InfoProperty>
          </Box>
        </TwoColumns>
      }>
      <Box direction="row" align="center" style={{ height: '60px', flexShrink: 0 }}>
        <Box style={{ width: '40px' }} align="center">
          <img style={{ height: '30px', width: '30px' }} alt="logout" src="/images/Github.png"></img>
        </Box>
        <Box style={{ padding: '0px 8px', fontSize: styleConstants.headingFontSizes[1], fontWeight: '700' }}>
          Github
        </Box>
      </Box>

      <Box style={{ marginTop: '13px', flexShrink: 0 }}>
        This campaign calculates total number of Pull requests and weighs them with respect to reactions to give points.
        Verify Github to participate
      </Box>
    </ExpansibleCard>
  );

  const contributors_table = (
    <>
      {shares !== undefined ? (
        <>
          <Heading style={{ fontSize: HEADING_SIZE }}>Contributors Board</Heading>
          <AppCard>
            <RewardsTable
              shares={shares}
              showReward
              raised={otherDetails?.raised}
              style={{ marginBottom: '36px' }}
              updatePage={updatePage}></RewardsTable>
          </AppCard>
        </>
      ) : (
        <Spinner></Spinner>
      )}
    </>
  );

  const funders = <Box>Funders table</Box>;

  const fundsColumns = ['1fr', '1fr', '1fr'];
  const fundsRows = ['auto'];

  const fundColumnsAt: Record<Breakpoint, GridSizeType[]> = {
    small: fundsColumns,
    medium: fundsColumns,
    large: fundsColumns,
    xlarge: fundsColumns,
  };

  const fundRowsAt: Record<Breakpoint, GridSizeType[]> = {
    small: fundsRows,
    medium: fundsRows,
    large: fundsRows,
    xlarge: fundsRows,
  };

  const funds = (
    <ResponsiveGrid style={{ width: '100%' }} gap="1vw" columnsAt={fundColumnsAt} rowsAt={fundRowsAt}>
      <BalanceCard title="Total Rewards" value={valueLocked} symbol="$"></BalanceCard>
      {customAsset ? (
        <>
          <BalanceCard
            title="Custom Assets"
            value={ethers.utils.formatUnits(customAsset.balance, customAsset.decimals)}
            coin={customAsset.name}></BalanceCard>
        </>
      ) : (
        <></>
      )}
      <BalanceCard title="Available to Claim" value={valueLocked} symbol="$"></BalanceCard>
      <Box>
        <Box direction="row" align="center"></Box>
      </Box>

      <FundCampaign
        onSuccess={() => {
          setShowFund(false);
          getOtherDetails();
        }}
        assets={assets}
        chainId={campaign.chainId}
        address={campaign.address}></FundCampaign>
    </ResponsiveGrid>
  );

  const claim = (
    <>
      <ClaimButton campaignAddress={campaign.address}></ClaimButton>
    </>
  );

  const guardian = <CampaignGuardian campaignAddress={campaign.address}></CampaignGuardian>;

  const left = (
    <>
      {details}
      {info}
      {contributors_table}
      {funders}
    </>
  );

  const right = (
    <>
      {claim}
      {funds}
      {guardian}
    </>
  );

  return (
    <Box
      style={{
        paddingTop: HEADER_HEIGHT,
        paddingBottom: '40px',
        paddingLeft: '5vw',
        paddingRight: '5vw',
      }}>
      <Box style={{ margin: '50px 0px' }}>
        Home {'>'} {campaign.title}
      </Box>

      <Box
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <CampaignGrid>
          <Box gridArea={CampaignAreas.left}>{left}</Box>
          <Box gridArea={CampaignAreas.right}>{right}</Box>
        </CampaignGrid>
      </Box>
    </Box>
  );
};
