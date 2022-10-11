import { Box, CheckBox, Text } from 'grommet';
import { ChainsDetails, TokenBalance, TreeClaimInfo } from '@dao-strategies/core';
import { FC, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { claimRewards } from '../pages/campaign.support';

import { useNowContext } from '../hooks/useNow';
import { useCampaignInstance } from '../hooks/useContracts';
import { truncate } from '../utils/ethers';

import { AppButton, AppInput, AppModal, IElement } from './styles/BasicElements';
import { AssetsTable, ChainTag } from './Assets';
import { BalanceCard } from '../pages/campaign/BalanceCard';

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
  const { campaign, claimInfo } = useCampaignContext();

  const [showClaim, setShowClaim] = useState<boolean>(false);
  const [hasTargetAddress, setHasTargetAddress] = useState<boolean>(false);

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
      (inPpClaim !== undefined && inPpClaim.shares !== undefined),
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

    await claimRewards(
      campaignInstance,
      account,
      status.claim.shares,
      status.claim.proof,
      status.claim.assets.map((asset) => asset.address)
    );
  };

  const claimAssets = ((): undefined | { shares: string; assets: TokenBalance[] } => {
    if (status.claim) {
      return {
        assets: status.claim.assets,
        shares: status.claim.shares,
    }
  })();

  const showCanClaim = (status.canClaim || status.willCanClaim) && claimAssets !== undefined;
  const claimInFuture = status.willCanClaim && claimInfo && claimInfo.activationTime && now;

  return (
    <>
      {showCanClaim ? (
        <AppModal heading="Claim Reward" onClosed={() => setShowClaim(false)}>
          <Box>
            {status.claim ? <AssetsTable showSummary assets={status.claim.assets}></AssetsTable> : <></>}

            <Box style={{ marginTop: '32px' }} direction="row" align="center">
              <Box style={{ marginRight: '16px' }}>Claim to custom address</Box>
              <CheckBox toggle onChange={(event) => setHasTargetAddress(event.target.checked)}></CheckBox>
            </Box>

            {hasTargetAddress ? <AppInput style={{ marginTop: '20px' }} placeholder="0x..."></AppInput> : <></>}

            <AppButton style={{ marginTop: '32px' }} primary onClick={() => claim()}>
              Claim
            </AppButton>
          </Box>
        </AppModal>
      ) : (
        <></>
      )}
      <BalanceCard
        style={{ padding: '24px', ...props.style }}
        title="My Rewards"
        assets={claimAssets?.assets}
        action={
          showCanClaim ? (
            <>
              {? (
                <Box>Claiming will be enabled in {claimInfo.activationTime - now.getTime()}</Box>
              ) : (
                <></>
              )}
              <AppButton
                disabled={status.willCanClaim}
                style={{ width: '100%' }}
                primary
                onClick={() => setShowClaim(true)}>
                Claim
              </AppButton>
            </>
          ) : (
            <>No rewards found</>
          )
        }></BalanceCard>
    </>
  );
};
