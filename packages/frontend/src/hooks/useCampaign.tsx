import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
  CampaignClaimInfo,
  CampaignOnchainDetails,
  CampaignReadDetails,
  SharesRead,
  CampaignFundersRead,
  Page,
  FundEventRead,
} from '@dao-strategies/core';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from './useLoggedUser';

export type CampaignContextType = {
  isLoading: boolean;
  campaign: CampaignReadDetails | undefined;
  getShares: (page: Page) => Promise<void>;
  shares: SharesRead | undefined;
  getOtherDetails: () => Promise<void>;
  otherDetails: CampaignOnchainDetails | undefined;
  checkClaimInfo: () => Promise<void>;
  claimInfo: CampaignClaimInfo | undefined;
  getFunders: (page?: Page, force?: boolean) => Promise<void>;
  funders: CampaignFundersRead | undefined;
  getFundEvents: (force?: boolean) => Promise<void>;
  fundEvents: FundEventRead[] | undefined;
};

const CampaignContextValue = createContext<CampaignContextType | undefined>(undefined);

export interface CampaignContextProps {
  address: ReactNode;
  children: ReactNode;
}

export const CampaignContext: FC<CampaignContextProps> = (props: CampaignContextProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignReadDetails>();
  const { user } = useLoggedUser();

  const [shares, setShares] = useState<SharesRead>();
  const [funders, setFunders] = useState<CampaignFundersRead>();
  const [lastPage, setLastPage] = useState<Page>();
  const [fundEvents, setFundEvents] = useState<FundEventRead[]>();
  const [otherDetails, setOtherDetails] = useState<CampaignOnchainDetails>();
  const [claimInfo, setClaimInfo] = useState<CampaignClaimInfo>();

  const getShares = useCallback(
    async (page: Page): Promise<void> => {
      if (campaign === undefined) return undefined;

      const response = await fetch(ORACLE_NODE_URL + `/campaign/sharesFromUri/${campaign.uri}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
        credentials: 'include',
      });

      const rewards = await response.json();
      setShares(rewards);
    },
    [campaign]
  );

  const getOtherDetails = useCallback(async (): Promise<void> => {
    fetch(ORACLE_NODE_URL + `/campaign/${props.address}/otherDetails`, {}).then((response) => {
      response.json().then((_details) => {
        setOtherDetails(_details);
      });
    });
  }, [props.address]);

  const checkClaimInfo = useCallback(async (): Promise<void> => {
    console.log('checking claim info');

    if (!campaign) return;
    if (!user) return;

    const response = await fetch(ORACLE_NODE_URL + `/campaign/claimInfo/${campaign.address}/${user.address}`, {
      method: 'get',
      credentials: 'include',
    });

    const claimInfo = await response.json();
    setClaimInfo(Object.keys(claimInfo).length > 0 ? claimInfo : undefined);
  }, [campaign, user]);

  const getFunders = useCallback(
    async (page?: Page, force?: boolean): Promise<void> => {
      console.log('checking funders');

      const _page = page === undefined ? lastPage : page;

      if (!_page) {
        throw Error(`Page undefined`);
      }

      setLastPage(_page);

      if (!campaign) return;

      const response = await fetch(ORACLE_NODE_URL + `/campaign/funders/${campaign.uri}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: _page, force }),
        credentials: 'include',
      });

      const _funders = await response.json();
      console.log('setting funders', { _funders });
      setFunders(Object.keys(_funders).length > 0 ? _funders : undefined);
    },
    [campaign]
  );

  const getFundEvents = useCallback(
    async (force?: boolean): Promise<void> => {
      console.log('checking getFundEvents', { force });

      if (!campaign) return;

      const response = await fetch(ORACLE_NODE_URL + `/campaign/fundEvents/${campaign.uri}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: 10, force }),
        credentials: 'include',
      });

      const _funders = await response.json();

      console.log('recent getFundEvents', _funders);
      setFundEvents(Object.keys(_funders).length > 0 ? _funders : undefined);
    },
    [campaign]
  );

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

  useEffect(() => {
    checkClaimInfo();
  }, [user]);

  return (
    <CampaignContextValue.Provider
      value={{
        isLoading,
        campaign,
        getShares,
        shares,
        getOtherDetails,
        otherDetails,
        checkClaimInfo,
        claimInfo,
        getFunders,
        funders,
        getFundEvents,
        fundEvents,
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
