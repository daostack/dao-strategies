import { useEffect, useState } from 'react';
import { CampaignOnchainDetails, CampaignReadDetails } from '@dao-strategies/core';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { RewardsMap } from '../pages/campaign.support';

export const useCampaign = (
  address: string | undefined
): {
  isLoading: boolean;
  campaign: CampaignReadDetails | undefined;
  getRewards: () => void;
  rewards: RewardsMap | undefined;
  getOtherDetails: () => void;
  otherDetails: CampaignOnchainDetails | undefined;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignReadDetails>();
  const [rewards, setRewards] = useState<RewardsMap>();
  const [otherDetails, setOtherDetails] = useState<CampaignOnchainDetails>();

  const getRewards = async (): Promise<void> => {
    if (campaign === undefined) return undefined;

    const response = await fetch(ORACLE_NODE_URL + `/campaign/simulateFromUri/${campaign.uri}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const rewards = await response.json();
    setRewards(rewards);
  };

  const getOtherDetails = async (): Promise<void> => {
    fetch(ORACLE_NODE_URL + `/campaign/${address}/otherDetails`, {}).then((response) => {
      response.json().then((_details) => {
        setOtherDetails(_details);
      });
    });
  };

  useEffect(() => {
    if (address !== undefined) {
      fetch(ORACLE_NODE_URL + `/campaign/${address}`, {}).then((response) => {
        response.json().then((_campaign) => {
          setCampaign(_campaign);
          setIsLoading(false);
        });
      });
    }
  }, [address]);

  return {
    isLoading,
    campaign,
    getRewards,
    rewards,
    getOtherDetails,
    otherDetails,
  };
};
