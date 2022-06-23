import { useEffect, useState } from 'react';
import { ORACLE_NODE_URL } from '../config/appConfig';
import { CampaignDetails, RewardsMap } from '../pages/campaign.support';

export const useCampaign = (
  address: string | undefined
): {
  isLoading: boolean;
  campaign: CampaignDetails | undefined;
  getRewards: () => void;
  rewards: RewardsMap | undefined;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignDetails>();
  const [rewards, setRewards] = useState<RewardsMap>();

  const getRewards = async (): Promise<RewardsMap | undefined> => {
    if (campaign === undefined) return undefined;

    const response = await fetch(ORACLE_NODE_URL + `/campaign/simulateFromUri/${campaign.uri}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const result = await response.json();
    setRewards(result.rewards);
  };

  useEffect(() => {
    fetch(ORACLE_NODE_URL + `/campaign/${address}`, {}).then((response) => {
      response.json().then((data) => {
        setIsLoading(false);
        setCampaign(data);
      });
    });
  }, [address]);

  return {
    isLoading,
    campaign,
    getRewards,
    rewards,
  };
};
