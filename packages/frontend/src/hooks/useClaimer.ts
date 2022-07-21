import { useEffect, useState } from 'react';
import { CampaignClaimInfo } from '@dao-strategies/core';

import { ORACLE_NODE_URL } from '../config/appConfig';

export const useClaimer = (
  campaignAddress: string | undefined,
  userAddress: string | undefined
): {
  isLoading: boolean;
  claimInfo: CampaignClaimInfo | undefined;
  check: () => void;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [claimInfo, setClaimInfo] = useState<CampaignClaimInfo>();

  const check = async (): Promise<void> => {
    if (campaignAddress === undefined) return undefined;
    if (userAddress === undefined) return undefined;

    setIsLoading(true);
    const response = await fetch(ORACLE_NODE_URL + `/campaign/claimInfo/${campaignAddress}/${userAddress}`, {
      method: 'get',
      credentials: 'include',
    });

    const result = await response.json();
    setIsLoading(false);
    setClaimInfo(Object.keys(result).length > 0 ? result : undefined);
  };

  useEffect(() => {
    check();
  }, [campaignAddress, userAddress]);

  return {
    isLoading,
    claimInfo,
    check,
  };
};
