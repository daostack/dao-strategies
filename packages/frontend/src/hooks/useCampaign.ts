import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';

import hardhatContractsJson from '../generated/hardhat_contracts.json';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { CampaignDetails, RewardsMap } from '../pages/campaign.support';
import { erc20ABI, useProvider } from 'wagmi';
import { assetAddress, isNative, keyOfName } from '../pages/create/chains.map';

const EthCampaignJSON: any = (hardhatContractsJson as any)['31337']['localhost']['contracts']['EthCampaign'];

export interface RealtimeCampaignDetails {
  fundsRaised?: BigNumber;
  rewardsAvailable?: BigNumber;
}

export const useCampaign = (
  address: string | undefined
): {
  isLoading: boolean;
  campaign: CampaignDetails | undefined;
  getRewards: () => void;
  rewards: RewardsMap | undefined;
  otherDetails: RealtimeCampaignDetails;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignDetails>();
  const [rewards, setRewards] = useState<RewardsMap>();
  const [otherDetails, setOtherDetails] = useState<RealtimeCampaignDetails>({});
  const provider = useProvider();

  const getRewards = async (): Promise<RewardsMap | undefined> => {
    if (campaign === undefined) return undefined;

    const response = await fetch(ORACLE_NODE_URL + `/campaign/simulateFromUri/${campaign.uri}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const rewards = await response.json();
    setRewards(rewards);
  };

  const getCampaignCurrentData = async () => {
    if (campaign !== undefined && address !== undefined) {
      // const contract = new Contract(address, EthCampaignJSON.abi, provider);
      const chainKey = keyOfName(campaign.chain);
      let getBalance: Promise<BigNumber>;

      if (isNative(chainKey, campaign.asset)) {
        getBalance = provider.getBalance(campaign.address);
      } else {
        const tokenAddress = assetAddress(chainKey, campaign.asset);
        const token = new Contract(tokenAddress, erc20ABI, provider);
        getBalance = token.balanceOf(campaign.address);
      }

      getBalance
        .then((balance) => {
          setOtherDetails({ ...otherDetails, fundsRaised: balance });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    if (address !== undefined) {
      fetch(ORACLE_NODE_URL + `/campaign/${address}`, {}).then((response) => {
        response.json().then((_campaign) => {
          setIsLoading(false);
          setCampaign(_campaign);
        });
      });
    }
  }, [address]);

  useEffect(() => {
    if (campaign !== undefined && address !== undefined) {
      getCampaignCurrentData();
    }
  }, [campaign, address]);

  return {
    isLoading,
    campaign,
    otherDetails,
    getRewards,
    rewards,
  };
};
