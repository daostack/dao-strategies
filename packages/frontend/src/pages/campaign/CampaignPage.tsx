import { Box, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { ChainsDetails, Page } from '@dao-strategies/core';

import { Countdown } from '../../components/Countdown';
import { RewardsTable } from '../../components/RewardsTable';
import {
  AppButton,
  AppCallout,
  AppCard,
  AppHeading,
  AppModal,
  AppTag,
  ExpansibleCard,
  ExpansiveParagraph,
  InfoProperty,
} from '../../components/styles/BasicElements';
import { TwoColumns, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { truncate } from '../../utils/ethers';
import { AdvancedCampaignStatus } from '../../components/AdvancedCampaignStatus';
import { DateManager } from '../../utils/date.manager';
import { HEADER_HEIGHT } from '../AppHeader';
import { CampaignAreas, CampaignGrid } from './CampaignGrid';
import { Address } from '../../components/Address';
import { BalanceCard } from './BalanceCard';
import { styleConstants } from '../../components/styles/themes';
import { ClaimCard } from '../../components/ClaimRewards';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { Link } from 'react-router-dom';
import { FundersTable } from '../../components/FundersTable';
import { Refresh } from 'grommet-icons';

export interface ICampaignPageProps {
  dum?: any;
}

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const [showFund, setShowFund] = useState<boolean>(false);
  const [showGuardianControl, setShowGuardianControl] = useState<boolean>(false);

  const { isLoading, campaign, getShares, shares, getOtherDetails, otherDetails, checkClaimInfo, funders, getFunders } =
    useCampaignContext();

  const { user } = useLoggedUser();

  const updatePage = (page: Page) => {
    getShares(page);
  };

  useEffect(() => {
    getShares({ number: 0, perPage: 6 });
    getOtherDetails();
    checkClaimInfo();
    getFunders({ number: 0, perPage: 6 });
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
          <AppHeading level="1">{campaign.title}</AppHeading>
        </Box>
      </Box>

      {otherDetails?.publishInfo?.status.locked ? (
        <AppCallout style={{ marginBottom: '16px' }}>Campaign locked</AppCallout>
      ) : (
        <></>
      )}

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

      {/* <Box direction="row" align="center" justify="start" style={{ marginTop: '16px', fontWeight: 400 }}>
        <Box direction="row">
          Created by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.creatorId} chainId={campaign.chainId}></Address>
        </Box>
        <Box style={{ marginLeft: '16px' }} direction="row">
          Guarded by:{' '}
          <Address style={{ marginLeft: '8px' }} address={campaign.guardian} chainId={campaign.chainId}></Address>
        </Box>
      </Box> */}

      <Box>
        <ExpansiveParagraph maxHeight={120}>{campaign.description}</ExpansiveParagraph>
      </Box>
    </AppCard>
  );

  const info = (
    <ExpansibleCard
      style={{ marginTop: '16px' }}
      padding={[24, 24, 36, 24]}
      hiddenPart={
        <TwoColumns boxes={{ align: 'start', justify: 'start' }} grid={{ style: { marginTop: '40px' } }}>
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
              <Box>Start date: {DateManager.from(campaign.strategyParams.timeRange.start).toString()}</Box>
              <Box>End date: {DateManager.from(campaign.strategyParams.timeRange.end).toString()}</Box>
            </InfoProperty>
            <InfoProperty style={{ marginTop: '36px' }} title="Campaign address">
              <Address address={campaign.address} chainId={campaign.chainId}></Address>
            </InfoProperty>
          </Box>
        </TwoColumns>
      }>
      <Box direction="row" align="center">
        <Box style={{ width: '16px' }} align="center">
          <img style={{ height: '16px', width: '16px' }} alt="logout" src="/images/Github.png"></img>
        </Box>
        <AppHeading level="3" style={{ padding: '0px 8px' }}>
          Github
        </AppHeading>
      </Box>

      <Box style={{ marginTop: '13px', flexShrink: 0 }}>
        This campaign calculates the total number of pull-requests made to one or more github repositories and weighs
        them with respect to the reactions received.
      </Box>
    </ExpansibleCard>
  );

  const contributors_table = (
    <>
      {shares !== undefined ? (
        <>
          <AppCard style={{ marginTop: '52px', padding: '24px 24px' }}>
            <AppHeading level="2" style={{ marginBottom: '24px' }}>
              Contributors board
            </AppHeading>
            <RewardsTable
              shares={shares}
              showReward
              raised={otherDetails?.raised}
              updatePage={updatePage}></RewardsTable>
          </AppCard>
        </>
      ) : (
        <Spinner></Spinner>
      )}
    </>
  );

  const fundersTable = (
    <AppCard style={{ marginTop: '40px', padding: '24px 24px' }}>
      {funders !== undefined ? (
        <>
          <Box direction="row" justify="between" align="center">
            <AppHeading level="2" style={{ marginBottom: '24px' }}>
              Funders
            </AppHeading>
            <Box style={{ height: '20px', width: '20px' }} onClick={() => getFunders(funders.page)}>
              <Refresh style={{ height: '20px', width: '20px' }}></Refresh>
            </Box>
          </Box>

          <FundersTable funders={funders} updatePage={updatePage}></FundersTable>
        </>
      ) : (
        <Spinner></Spinner>
      )}
    </AppCard>
  );

  const funds = (
    <>
      {showFund ? (
        <AppModal
          heading="Fund Campaign"
          onClosed={() => setShowFund(false)}
          onSuccess={() => {
            setShowFund(false);
            getOtherDetails();
          }}>
          <FundCampaign assets={assets} chainId={campaign.chainId} address={campaign.address}></FundCampaign>
        </AppModal>
      ) : (
        <></>
      )}
      <BalanceCard
        style={{ padding: '24px' }}
        title="Rewards Raised"
        assets={otherDetails?.balances}
        value={valueLocked}
        symbol="$"
        action={
          <AppButton style={{ width: '100%' }} onClick={() => setShowFund(true)} primary>
            Fund Campaign
          </AppButton>
        }></BalanceCard>
    </>
  );

  const claim = <ClaimCard style={{ marginBottom: '40px' }} campaignAddress={campaign.address}></ClaimCard>;

  const guardian = (
    <>
      {showGuardianControl ? (
        <AppModal heading="Advanced Status" onClosed={() => setShowGuardianControl(false)}>
          <AdvancedCampaignStatus campaignAddress={campaign.address}></AdvancedCampaignStatus>
        </AppModal>
      ) : (
        <></>
      )}
      <Box style={{ padding: '0px 24px' }}>
        <AppButton primary onClick={() => setShowGuardianControl(true)} style={{ marginTop: '36px' }}>
          Show Advanced Status
        </AppButton>
      </Box>
    </>
  );

  const left = (
    <>
      {details}
      {info}
      {contributors_table}
      {fundersTable}
    </>
  );

  const right = (
    <>
      {user !== undefined ? claim : <></>}
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
      <Box style={{ margin: '50px 0px' }} direction="row" align="center">
        <Link style={{ marginRight: '6px', textDecoration: 'none' }} to="/">
          Home
        </Link>{' '}
        {'>'} {campaign.title}
      </Box>

      <Box
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <CampaignGrid gap="24px">
          <Box gridArea={CampaignAreas.left}>{left}</Box>
          <Box gridArea={CampaignAreas.right}>{right}</Box>
        </CampaignGrid>
      </Box>
    </Box>
  );
};
