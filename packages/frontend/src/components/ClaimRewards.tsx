import { Box, Layer } from 'grommet';
import { ChainsDetails, TreeClaimInfo } from '@dao-strategies/core';
import { FC, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { claimRewards } from '../pages/campaign.support';

import { useNow } from '../hooks/useNow';
import { useCampaignInstance } from '../hooks/useContracts';
import { truncate } from '../utils/ethers';

import { AppButton, AppModal, IElement } from './styles/BasicElements';
import { AssetBalance } from './Assets';
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

  const { now } = useNow();
  const { user, account, githubAccount } = useLoggedUser();

  const campaignInstance = useCampaignInstance(props.campaignAddress);

  if (campaign === undefined) return <></>;

  const currentClaim = claimInfo !== undefined && claimInfo.current !== undefined ? claimInfo.current : undefined;
  const pendingClaim = claimInfo !== undefined && claimInfo.pending !== undefined ? claimInfo.pending : undefined;

  const status: UserClaimStatus = {
    isLogged: user !== undefined,
    isVerified: githubAccount !== undefined,
    canClaim: currentClaim !== undefined && currentClaim.shares !== undefined,
    willCanClaim: pendingClaim !== undefined && pendingClaim.shares !== undefined,
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

  let claimValue: string = '0';
  const canClaim = (status.canClaim || status.willCanClaim) && status.claim !== undefined;

  if (canClaim) {
    claimValue =
      status.claim && status.claim.assets
        ? truncate(ChainsDetails.valueOfAssets(status.claim.assets).toString(), 2)
        : '0';
  }

  return (
    <>
      {status.canClaim && showClaim ? (
        <AppModal onClosed={() => setShowClaim(false)}>
          <Box pad="medium">
            {status.claim && status.claim.assets !== undefined ? (
              status.claim.assets.map((asset) => {
                return <AssetBalance asset={asset}></AssetBalance>;
              })
            ) : (
              <></>
            )}
            <div>~{claimValue} usd</div>
            <AppButton primary onClick={() => claim()}>
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
        value={claimValue}
        symbol="$"
        action={
          canClaim ? (
            <AppButton style={{ width: '100%' }} primary onClick={() => setShowClaim(true)}>
              Claim
            </AppButton>
          ) : (
            <>No rewards found</>
          )
        }></BalanceCard>
    </>
  );
};
