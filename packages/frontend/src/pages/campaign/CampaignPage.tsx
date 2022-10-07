import { Link } from 'react-router-dom';
import { Box, Spinner } from 'grommet';
import { FC, useEffect, useRef, useState } from 'react';
import { ChainsDetails, cmpAddresses, Page } from '@dao-strategies/core';
import { RewardsTable } from '../../components/RewardsTable';

import {
  AppButton,
  AppCallout,
  AppCard,
  AppHeading,
  AppModal,
  CampaignIcon,
  ExpansibleCard,
  ExpansiveParagraph,
  InfoProperty,
  RepoTag,
} from '../../components/styles/BasicElements';
import { TwoColumns, ViewportContainer } from '../../components/styles/LayoutComponents.styled';
import { useCampaignContext } from '../../hooks/useCampaign';
import { FundCampaign } from '../../components/FundCampaign';
import { DateManager } from '../../utils/date.manager';
import { HEADER_HEIGHT, MAX_WIDTH } from '../AppHeader';
import { CampaignAreas, CampaignGrid } from './CampaignGrid';
import { Address } from '../../components/Address';
import { BalanceCard } from './BalanceCard';
import { styleConstants } from '../../components/styles/themes';
import { ClaimCard } from '../../components/ClaimRewards';
import { useLoggedUser } from '../../hooks/useLoggedUser';
import { FundersTable } from '../../components/FundersTable';
import { Refresh } from 'grommet-icons';
import { FixedAdmin } from './fixed.admin';
import React from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { ChainTag } from '../../components/Assets';
import { CampaignStatus } from '../../components/CampaignStatus';
import { RouteNames } from '../MainPage';

/** constants to deduce the size of the fixed-size admin control button */
export const CAMPAIGN_PAD_SIDES = 5;
export const CAMPAIGN_GAP = 24;
const PER_PAGE = 8;
const DEBUG = true;

export interface ICampaignPageProps {
  dum?: any;
}

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const [showFund, setShowFund] = useState<boolean>(false);

  const {
    isLoading,
    campaign,
    getShares,
    shares,
    getOtherDetails,
    otherDetails,
    checkClaimInfo,
    funders,
    getFunders,
    getFundEvents,
  } = useCampaignContext();

  const { user } = useLoggedUser();
  /** Things below are needed to keep the width of the admin button equal to the width of the Fund Campaign card */
  // react to window dimension changes
  const { w_width } = useWindowDimensions();
  // remember the width
  const [colWidth, setColWidth] = useState<number>(0);
  // remember the DOM element
  let colRef = useRef<HTMLDivElement>(null);

  // called everytime the DOM element changes
  const fundCardRefUpdated = (ref: React.RefObject<HTMLDivElement>): void => {
    if (ref !== null) {
      colRef = ref;
      checkSize();
    }
  };

  // called to set the size
  const checkSize = () => {
    if (colRef !== null) {
      setColWidth((colRef as any).offsetWidth);
    }
  };

  // needed to react to window resize
  useEffect(() => checkSize(), [w_width]);

  const updatePage = (page: Page) => {
    getShares(page);
  };

  useEffect(() => {
    if (DEBUG) console.log('Campaign Page updated', { campaign });
    getShares({ number: 0, perPage: PER_PAGE });
    getOtherDetails();
    checkClaimInfo();
    getFunders({ number: 0, perPage: PER_PAGE });
    /** we want to react when campaign is loaded only */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  const fundedSuccess = async () => {
    setShowFund(false);
    getOtherDetails();
    // force re-index funders
    await getFunders(undefined, true);
    getFundEvents();
  };

  if (campaign === undefined || isLoading)
    return (
      <ViewportContainer>
        please wait...
        <br></br>
        <Spinner />
      </ViewportContainer>
    );

  const assets = otherDetails && otherDetails.balances ? otherDetails.balances : [];
  const chain = ChainsDetails.chainOfId(campaign.chainId);

  const customAsset =
    otherDetails && otherDetails.balances
      ? otherDetails.balances.find((token) => cmpAddresses(token.address, campaign.customAssets[0]))
      : undefined;

  const details = (
    <AppCard style={{ paddingBottom: '18px' }}>
      <Box direction="row" align="center" justify="start" margin={{ right: 'medium' }}>
        <CampaignIcon iconSize="48px" src={campaign?.logoUrl} style={{ marginRight: '24px', flexShrink: '0' }} />
        <Box>
          <AppHeading level="1">{campaign.title}</AppHeading>
        </Box>
      </Box>

      <CampaignStatus style={{ marginTop: '18.5px' }} />

      <Box>
        {campaign.description !== '' ? (
          <ExpansiveParagraph maxHeight={120}>{campaign.description}</ExpansiveParagraph>
        ) : (
          <></>
        )}
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
              {campaign.strategyParams.repositories.map((repo: any, ix: number) => (
                <RepoTag repo={`${repo.owner}/${repo.repo}`} key={ix} style={{ marginBottom: '6px' }} />
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
              chainId={campaign.chainId}
              showReward
              raised={otherDetails?.raised}
              updatePage={updatePage}
              perPage={PER_PAGE}></RewardsTable>
          </AppCard>
        </>
      ) : (
        <Spinner></Spinner>
      )}
    </>
  );

  const fundersTable = (
    <AppCard style={{ marginTop: '40px', padding: '24px 24px' }}>
      <Box direction="row" justify="between" align="center">
        <AppHeading level="2" style={{ marginBottom: '24px' }}>
          Funders
        </AppHeading>
        <Box style={{ height: '20px', width: '20px' }} onClick={() => getFunders()}>
          <Refresh style={{ height: '20px', width: '20px' }}></Refresh>
        </Box>
      </Box>

      <FundersTable funders={funders} updatePage={updatePage} perPage={PER_PAGE}></FundersTable>
    </AppCard>
  );

  const funds = (
    <>
      {showFund ? (
        <AppModal heading="Fund Campaign" onClosed={() => setShowFund(false)} onSuccess={fundedSuccess}>
          <FundCampaign
            assets={assets}
            defaultAsset={customAsset}
            chainId={campaign.chainId}
            address={campaign.address}
            style={{ marginTop: '64px' }}></FundCampaign>
        </AppModal>
      ) : (
        <></>
      )}
      <BalanceCard
        ref={fundCardRefUpdated as any}
        style={{ padding: '24px' }}
        title="Rewards Raised"
        subtitle={
          <>
            <ChainTag style={{ margin: '18px 0px' }} chain={chain}></ChainTag>
          </>
        }
        assets={otherDetails?.balances}
        preferred={customAsset?.id}
        action={
          <AppButton
            secondary
            label="Fund Campaign"
            style={{ width: '100%', fontSize: styleConstants.textFontSizes.small }}
            onClick={() => setShowFund(true)}
          />
        }></BalanceCard>
    </>
  );

  const claim = <ClaimCard style={{ marginTop: '40px' }} campaignAddress={campaign.address}></ClaimCard>;
  const guardian = <FixedAdmin btnWidth={colWidth} address={campaign.address}></FixedAdmin>;

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
      {funds}
      {user !== undefined ? claim : <></>}
      {guardian}
    </>
  );

  return (
    <Box
      style={{
        paddingTop: HEADER_HEIGHT,
        paddingBottom: '40px',
        paddingLeft: `${CAMPAIGN_PAD_SIDES}vw`,
        paddingRight: `${CAMPAIGN_PAD_SIDES}vw`,
      }}>
      <Box style={{ margin: '50px 0px' }} direction="row" align="center">
        <Link style={{ marginRight: '6px', textDecoration: 'none' }} to={RouteNames.Campaigns}>
          Home
        </Link>{' '}
        {'>'} {campaign.title.length > 50 ? `${campaign.title.substr(0, 50)}...` : campaign.title}
      </Box>

      <Box
        style={{
          maxWidth: `${MAX_WIDTH}px`,
          margin: '0 auto',
        }}>
        <CampaignGrid gap={`${CAMPAIGN_GAP}px`}>
          <Box gridArea={CampaignAreas.left}>{left}</Box>
          <Box gridArea={CampaignAreas.right}>{right}</Box>
        </CampaignGrid>
      </Box>
    </Box>
  );
};
