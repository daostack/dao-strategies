import { Box, Spinner, Layer, Text, Heading, GridSizeType } from 'grommet';
import { Refresh } from 'grommet-icons';
import { FC, useEffect, useState } from 'react';
import { ChainsDetails, TokenBalance, Page } from '@dao-strategies/core';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import { AppButton, AppCallout, AppCard, ExpansiveParagraph } from '../../components/styles/BasicElements';
import { Breakpoint, ResponsiveGrid, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { AssetBalance } from '../../components/Assets';
import { truncate } from '../../utils/ethers';
import { CampaignGuardian } from '../../components/CampaignGuardian';
import { DateManager } from '../../utils/date.manager';
import { HEADER_HEIGHT } from '../AppHeader';
import { CampaignAreas, CampaignGrid } from './CampaignGrid';
import { Address } from '../../components/Address';
import { BalanceCard } from './BalanceCard';
import { theme } from '../../components/styles/themes';
import { ClaimButton } from '../../components/ClaimRewards';
import { ethers } from 'ethers';

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

  const state = (
    <Box style={{ padding: '30px 0px 60px 0px' }}>
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
    <Box style={{ paddingBottom: '18px' }}>
      <Box direction="row" align="center" justify="start">
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
    </Box>
  );

  const balances =
    otherDetails !== undefined ? (
      <Box direction="row">
        <Refresh onClick={() => getOtherDetails()}></Refresh>
        {otherDetails.balances ? (
          otherDetails.balances.map((token: TokenBalance) => {
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
    </ResponsiveGrid>
  );

  const description = (
    <Box style={{ marginBottom: '36px' }}>
      <ExpansiveParagraph maxHeight={200}>{campaign.description}</ExpansiveParagraph>
    </Box>
  );

  const table = (
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

  const leftPadLeft = '3vw';
  const buttonPad = 8;
  const buttonHeight = 50;

  const buttonStyle: React.CSSProperties = {
    height: `${buttonHeight}px`,
    width: `calc(50% - ${buttonPad / 2}px)`,
    color: '#0E0F19',
  };

  const buttonStyleSelected: React.CSSProperties = {
    borderRadius: `${buttonHeight / 2}px`,
    backgroundColor: theme.buttonLight,
    borderColor: theme.buttonLightBorder,
    border: 'solid 1px',
  };

  const fund = (
    <AppCard fill style={{ padding: '40px 24px', height: '350px' }}>
      <Box
        direction="row"
        align="center"
        style={{
          width: '100%',
          height: `${buttonHeight + 2 * buttonPad}px`,
          backgroundColor: '#fffFFF',
          borderRadius: `${(buttonHeight + 2 * buttonPad) / 2}px`,
          border: 'solid 1px',
          borderColor: '#F0EDED',
          padding: `${buttonPad}px`,
        }}>
        <AppButton
          style={{ ...buttonStyle, ...(showFund && buttonStyleSelected), marginRight: `${buttonPad}px` }}
          onClick={() => setShowFund(true)}>
          Fund
        </AppButton>
        <AppButton style={{ ...buttonStyle, ...(!showFund && buttonStyleSelected) }} onClick={() => setShowFund(false)}>
          Withdraw
        </AppButton>
      </Box>
      <Box fill justify="center">
        {showFund ? (
          <FundCampaign
            onSuccess={() => {
              setShowFund(false);
              getOtherDetails();
            }}
            assets={assets}
            chainId={campaign.chainId}
            address={campaign.address}></FundCampaign>
        ) : (
          <ClaimButton campaignAddress={campaign.address}></ClaimButton>
        )}
      </Box>
    </AppCard>
  );

  const info = <CampaignGuardian campaignAddress={campaign.address}></CampaignGuardian>;

  const rightPane = (
    <Box style={{ paddingLeft: leftPadLeft }}>
      {fund}
      {info}
    </Box>
  );

  return (
    <Box
      style={{
        paddingTop: HEADER_HEIGHT,
        paddingBottom: '40px',
        paddingLeft: '5vw',
        paddingRight: '5vw',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
      <CampaignGrid>
        <Box gridArea={CampaignAreas.state}>{state}</Box>
        <Box gridArea={CampaignAreas.details}>{details}</Box>
        <Box gridArea={CampaignAreas.funds}>{funds}</Box>
        <Box gridArea={CampaignAreas.description}>{description}</Box>
        <Box gridArea={CampaignAreas.table}>{table}</Box>
        <Box gridArea={CampaignAreas.rightPane}>{rightPane}</Box>
      </CampaignGrid>
    </Box>
  );
};
