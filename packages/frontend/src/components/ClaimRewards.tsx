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
  const [showClaim, setShowClaim] = useState<boolean>(false);
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

  const status: UserClaimStatus = {
    isLogged: user !== undefined,
    isVerified: user.verified.github != null,
    canClaim: claimInfo !== undefined && claimInfo.shares !== undefined,
    wasExecuted: campaign.executed,
  };

  if (!status.isVerified) {
    return (
      <>
        <AppButton onClick={() => navigate(RouteNames.Profile)}>Verify Github</AppButton>
      </>
    );
  }

  if (status.canClaim && claimInfo !== undefined) {
    return (
      <>
        {showClaim ? (
          <Layer onEsc={() => setShowClaim(false)} onClickOutside={() => setShowClaim(false)}>
            test
          </Layer>
        ) : (
          <></>
        )}
        <AppButton onClick={() => setShowClaim(true)}>Claim rewards</AppButton>
        <div>{formatEther(ethers.BigNumber.from(claimInfo.shares).mul(100), 2)}%</div>
      </>
    );
  }

  return <></>;
};
