import { FC } from 'react';
import { useCampaign } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useClaimer } from '../hooks/useClaimer';
import { AppButton } from './styles/BasicElements';
import { ethers } from 'ethers';

interface IParams {
  campaignAddress: string;
}

interface UserClaimStatus {
  isLogged: boolean;
  isVerified: boolean;
  canClaim: boolean;
  wasExecuted: boolean;
}

export const ClaimButton: FC<IParams> = (props: IParams) => {
  const { user, connect } = useLoggedUser();

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

  const status: UserClaimStatus = {
    isLogged: user !== undefined,
    isVerified: user.verified.github != null,
    canClaim: claimInfo !== undefined && claimInfo.shares !== undefined,
    wasExecuted: campaign.executed,
  };

  if (!status.isVerified) {
    return (
      <>
        <AppButton>Verify Github</AppButton>
      </>
    );
  }

  if (status.canClaim && claimInfo !== undefined) {
    return (
      <>
        My Reward <AppButton>Claim rewards</AppButton>
        <div>{ethers.utils.formatEther(claimInfo.shares)}</div>
      </>
    );
  }

  return <></>;
};
