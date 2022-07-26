import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { CampaignOnchainDetails, CampaignReadDetails } from '@dao-strategies/core';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { RewardsMap } from '../pages/campaign.support';

export type CampaignContextType = {
  isLoading: boolean;
  campaign: CampaignReadDetails | undefined;
  getRewards: () => void;
  rewards: RewardsMap | undefined;
  getOtherDetails: () => void;
  otherDetails: CampaignOnchainDetails | undefined;
};

const CampaignContextValue = createContext<CampaignContextType | undefined>(undefined);

export interface CampaignContextProps {
  address: ReactNode;
  children: ReactNode;
}

export const CampaignContext: FC<CampaignContextProps> = (props: CampaignContextProps) => {
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
    fetch(ORACLE_NODE_URL + `/campaign/${props.address}/otherDetails`, {}).then((response) => {
      response.json().then((_details) => {
        setOtherDetails(_details);
      });
    });
  };

  useEffect(() => {
    if (props.address !== undefined) {
      fetch(ORACLE_NODE_URL + `/campaign/${props.address}`, {}).then((response) => {
        response.json().then((_campaign) => {
          setCampaign(_campaign);
          setIsLoading(false);
        });
      });
    }
  }, [props.address]);

  return (
    <CampaignContextValue.Provider
      value={{
        isLoading,
        campaign,
        getRewards,
        rewards,
        getOtherDetails,
        otherDetails,
      }}>
      {props.children}
    </CampaignContextValue.Provider>
  );
};

export const useCampaignContext = (): CampaignContextType => {
  const context = useContext(CampaignContextValue);
  if (!context) throw Error('useCampaign can only be used within the CampaignContext component');
  return context;
};
