import { useEffect, useState } from 'react';
import { ORACLE_NODE_URL } from '../config/appConfig';
import { CampaignDetails } from '../pages/campaign.support';

export const useCampaign = (
  address: string | undefined
): { isLoading: boolean; campaign: CampaignDetails | undefined } => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignDetails>();

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
  };
};
