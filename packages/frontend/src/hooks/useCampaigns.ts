import { CampaignReadDetails } from '@dao-strategies/core';
import { useEffect, useState } from 'react';
import { ORACLE_NODE_URL } from '../config/appConfig';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignReadDetails[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const get = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(ORACLE_NODE_URL + `/campaigns`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const campaigns: CampaignReadDetails[] = await response.json();
      setCampaigns(campaigns.filter((campaign) => campaign.address !== null));
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void get();
  }, []);

  return {
    campaigns: campaigns,
    isLoading,
    error: false,
  };
}
