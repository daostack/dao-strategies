import { ClaimInPp, TreeClaimInfo } from '@dao-strategies/core';
import { FC, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { claimRewards } from '../pages/campaign.support';

import { useNowContext } from '../hooks/useNow';
import { useCampaignInstance } from '../hooks/useContracts';

import { AppButton, AppCallout, AppInput, AppModal, IElement } from './styles/BasicElements';
import { AssetsTable } from './Assets';
import { Box, CheckBox } from 'grommet';
import { BalanceCard } from '../pages/campaign/BalanceCard';
import { Refresh } from 'grommet-icons';
import { styleConstants } from './styles/themes';
import { hasAssets } from '../utils/general';

interface IParams extends IElement {
  campaignAddress: string;
}

interface UserClaimStatus {
  isLogged: boolean;
  isVerified: boolean;
  canClaim: boolean;
  willCanClaim: boolean;
  claim: TreeClaimInfo | undefined;
  wasExecuted: boolean;
  wasPublished: boolean;
}

export const ClaimCard: FC<IParams> = (props: IParams) => {
  const { campaign, claimInfo, checkClaimInfo } = useCampaignContext();

  const [showClaim, setShowClaim] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);

  // const [hasTargetAddress, setHasTargetAddress] = useState<boolean>(false);

  const { now } = useNowContext();
  const { user, account, githubAccount } = useLoggedUser();

  const campaignInstance = useCampaignInstance(props.campaignAddress);

  if (campaign === undefined) return <></>;

  const currentClaim = claimInfo !== undefined && claimInfo.current !== undefined ? claimInfo.current : undefined;
  const pendingClaim = claimInfo !== undefined && claimInfo.pending !== undefined ? claimInfo.pending : undefined;
  const inPpClaim = claimInfo !== undefined && claimInfo.inPp !== undefined ? claimInfo.inPp : undefined;

  const status: UserClaimStatus = {
    isLogged: user !== undefined,
    isVerified: githubAccount !== undefined,
    canClaim: currentClaim !== undefined && currentClaim.shares !== undefined,
    willCanClaim:
      (pendingClaim !== undefined && pendingClaim.shares !== undefined) ||
      (inPpClaim !== undefined && inPpClaim.shares !== undefined && inPpClaim.shares !== '0'),
    claim: currentClaim !== undefined ? currentClaim : pendingClaim !== undefined ? pendingClaim : undefined,
    wasExecuted: campaign.executed,
    wasPublished: campaign.published,
  };

  const claim = async () => {
    if (
      account === undefined ||
      campaignInstance === undefined ||
      status.claim === undefined ||
      status.claim.shares === undefined ||
      status.claim.assets === undefined ||
      status.claim.proof === undefined ||
      campaign === undefined
    ) {
      throw new Error('claim info undefined');
    }

    setClaiming(true);
    try {
      await claimRewards(
        campaignInstance,
        account,
        status.claim.shares,
        status.claim.proof,
        status.claim.assets.map((asset) => asset.address)
      );
      checkClaimInfo();
      setShowClaim(false);
    } catch (e) {
      console.error(e);
    }

    setClaiming(false);
  };

  const claimAssets = ((): ClaimInPp | undefined => {
    if (status.claim && status.claim.assets && status.claim.shares) {
      return {
        assets: status.claim.assets,
        shares: status.claim.shares,
        activationTime: currentClaim ? 0 : claimInfo?.activationTime,
      };
    }

    if (inPpClaim && inPpClaim.assets && inPpClaim.shares && inPpClaim.activationTime) {
      return {
        assets: inPpClaim.assets,
        shares: inPpClaim.shares,
        activationTime: inPpClaim.activationTime,
      };
    }

    return undefined;
  })();

  const whyText = (() => {
    if (!campaign.executed) {
      return 'Campaign not yet executed';
    }

    if (status.willCanClaim && !status.canClaim) {
      return 'Campaign shares update pending';
    }
  })();

  const hasValue = claimAssets && claimAssets.assets && hasAssets(claimAssets.assets);
  const claimDisabled = (status.willCanClaim && !status.canClaim) || !hasValue;

  return (
    <>
      {showClaim ? (
        <AppModal heading="Claim Reward" onClosed={() => setShowClaim(false)}>
          <Box>
            {status.claim ? <AssetsTable showSummary assets={status.claim.assets}></AssetsTable> : <></>}
            {/* 
            <Box style={{ marginTop: '32px' }} direction="row" align="center">
              <Box style={{ marginRight: '16px' }}>Claim to custom address</Box>
              <CheckBox toggle onChange={(event) => setHasTargetAddress(event.target.checked)}></CheckBox>
            </Box>

            {hasTargetAddress ? <AppInput style={{ marginTop: '20px' }} placeholder="0x..."></AppInput> : <></>} */}

            <AppButton style={{ marginTop: '32px' }} primary onClick={() => claim()} disabled={claiming}>
              {claiming ? 'Claiming...' : 'Claim'}
            </AppButton>
          </Box>
        </AppModal>
      ) : (
        <></>
      )}
      <BalanceCard
        style={{ padding: '24px', position: 'relative', ...props.style }}
        title="My Rewards"
        assets={claimAssets?.assets}
        action={
          claimAssets && claimAssets.shares !== '0' ? (
            <Box style={{ width: '100%' }}>
              <AppButton
                disabled={claimDisabled}
                style={{ width: '100%' }}
                primary
                onClick={() => setShowClaim(true)}
                label={
                  claimDisabled ? (
                    now && claimAssets.activationTime && claimAssets.activationTime > 0 ? (
                      `${now.cloneToNow().prettyDiff(claimAssets.activationTime + campaign.CHALLENGE_PERIOD)} to claim`
                    ) : hasValue ? (
                      <></>
                    ) : (
                      <>No assets found</>
                    )
                  ) : (
                    <>Claim</>
                  )
                }
              />
              {claimDisabled ? (
                <Box
                  direction="row"
                  justify="center"
                  style={{
                    fontSize: styleConstants.textFontSizes.small,
                    color: styleConstants.colors.ligthGrayText2,
                    marginTop: '8px',
                  }}>
                  {whyText}
                </Box>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <AppCallout>{campaign.executed ? <>No rewards found</> : <>Campaign shares not yet computed</>}</AppCallout>
          )
        }>
        <Box
          style={{ position: 'absolute', right: '12px', top: '12px', height: '20px', width: '20px' }}
          onClick={() => checkClaimInfo()}>
          <Refresh style={{ height: '20px', width: '20px' }}></Refresh>
        </Box>
      </BalanceCard>
    </>
  );
};
