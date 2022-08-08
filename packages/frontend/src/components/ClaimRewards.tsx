import { useNavigate } from 'react-router-dom';
import { Refresh } from 'grommet-icons';
import { Box, Layer, Text } from 'grommet';
import { ChainsDetails, TreeClaimInfo } from '@dao-strategies/core';
import { FC, useEffect, useState } from 'react';

import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { useClaimer } from '../hooks/useClaimer';
import { RouteNames } from '../pages/MainPage';
import { claimRewards } from '../pages/campaign.support';

import { useNow } from '../hooks/useNow';
import { useCampaignInstance } from '../hooks/useContracts';
import { truncate } from '../utils/ethers';

import { AppButton } from './styles/BasicElements';
import { AssetBalance } from './Assets';
import { GithubVerification } from './GithubVerification';

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
  wasPublished: boolean;
}

export const ClaimButton: FC<IParams> = (props: IParams) => {
  const { campaign } = useCampaignContext();

  const [showClaim, setShowClaim] = useState<boolean>(false);
  const [showVerifyIdentity, setShowVerifyIdentity] = useState<boolean>(false);

  const { now } = useNow();
  const { user, connect, account } = useLoggedUser();

  const { claimInfo, check } = useClaimer(props.campaignAddress, user?.address);
  const campaignInstance = useCampaignInstance(props.campaignAddress);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('checking claim info');
      check();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  if (!status.wasExecuted) {
    return <Text>Campaign not yet executed</Text>;
  }

  if (!status.isVerified) {
    return (
      <>
        {showVerifyIdentity ? (
          <Layer onEsc={() => setShowVerifyIdentity(false)} onClickOutside={() => setShowVerifyIdentity(false)}>
            <GithubVerification></GithubVerification>
          </Layer>
        ) : (
          <></>
        )}
        <AppButton onClick={() => setShowVerifyIdentity(true)}>Verify Github</AppButton>
      </>
    );
  }

  if ((status.canClaim || status.willCanClaim) && status.claim !== undefined) {
    const claimValue = status.claim.assets
      ? truncate(ChainsDetails.valueOfAssets(status.claim.assets).toString(), 2)
      : 0;
    return (
      <>
        {status.canClaim && showClaim ? (
          <Layer onEsc={() => setShowClaim(false)} onClickOutside={() => setShowClaim(false)}>
            <Box pad="medium">
              {status.claim.assets !== undefined ? (
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
        <div>~{claimValue} usd</div>
        <Refresh onClick={() => check()}></Refresh>
      </>
    );
  }

  return (
    <Box pad="medium" style={{ textAlign: 'center' }}>
      Your github account @{user.verified.github} is not eligible for claiming rewards out of this campaign.
    </Box>
  );
};
