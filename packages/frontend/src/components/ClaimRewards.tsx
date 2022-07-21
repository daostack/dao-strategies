import { FC, useState } from 'react';
import { useCampaign } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useClaimer } from '../hooks/useClaimer';
import { AppButton } from './styles/BasicElements';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../pages/MainPage';
import { formatEther } from '../utils/ethers';
import { Layer } from 'grommet';
import { TreeClaimInfo } from '@dao-strategies/core';
import { useNow } from '../hooks/useNow';

interface IParams {
  campaignAddress: string;
}

interface UserClaimStatus {
  isLogged: boolean;
  isVerified: boolean;
  canClaim: boolean;
  willCanClaim: boolean;
  claim: TreeClaimInfo | undefined;
  wasExecuted: boolean;
}

export const ClaimButton: FC<IParams> = (props: IParams) => {
  const [showClaim, setShowClaim] = useState<boolean>(false);
  const { now } = useNow();
  const { user, connect } = useLoggedUser();
  const navigate = useNavigate();

  const { campaign } = useCampaign(props.campaignAddress);
  const { claimInfo } = useClaimer(props.campaignAddress, user?.address);

  if (user === undefined) {
    return (
      <>
        <AppButton onClick={() => connect()}>Connect Wallet</AppButton>
      </>
    );
  }

  if (campaign === undefined) return <></>;

  const currentClaim = claimInfo !== undefined && claimInfo.current !== undefined ? claimInfo.current : undefined;
  const pendingClaim = claimInfo !== undefined && claimInfo.pending !== undefined ? claimInfo.pending : undefined;

  const status: UserClaimStatus = {
    isLogged: user !== undefined,
    isVerified: user.verified.github != null,
    canClaim: currentClaim !== undefined && currentClaim.shares !== undefined,
    willCanClaim: pendingClaim !== undefined && pendingClaim.shares !== undefined,
    claim: currentClaim !== undefined ? currentClaim : pendingClaim !== undefined ? pendingClaim : undefined,
    wasExecuted: campaign.executed,
  };

  if (!status.isVerified) {
    return (
      <>
        <AppButton onClick={() => navigate(RouteNames.Profile)}>Verify Github</AppButton>
      </>
    );
  }

  if ((status.canClaim || status.willCanClaim) && status.claim !== undefined) {
    return (
      <>
        {status.canClaim && showClaim ? (
          <Layer onEsc={() => setShowClaim(false)} onClickOutside={() => setShowClaim(false)}>
            test
          </Layer>
        ) : (
          <></>
        )}
        {!status.canClaim && status.willCanClaim && now && claimInfo && claimInfo.activationTime ? (
          <>Pending {now.prettyDiff(claimInfo.activationTime)}</>
        ) : (
          <></>
        )}
        <AppButton disabled={!status.canClaim} onClick={() => setShowClaim(true)}>
          Claim
        </AppButton>
        <div>{formatEther(ethers.BigNumber.from(status.claim.shares).mul(100), 2)}%</div>
      </>
    );
  }

  return <></>;
};
