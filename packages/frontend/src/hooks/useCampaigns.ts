import { Typechain } from '@dao-strategies/core';
import { useEffect, useState } from 'react';
import { ORACLE_NODE_URL } from '../config/appConfig';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Typechain.Campaign[]>([]);

  const get = async () => {
    const response = await fetch(ORACLE_NODE_URL + `/campaigns`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const campaigns = await response.json();
    setCampaigns(campaigns);
  };

  useEffect(() => {
    void get();
  }, []);

  return {
    campaigns: campaigns,
    isLoading: false,
    error: false,
  };
}
