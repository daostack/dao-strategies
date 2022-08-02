import { Chain } from '@wagmi/core';
import { BigNumber } from 'ethers';

import { Strategy_ID } from './strategies';
import { World, WorldConfig } from './world/World';

export type BalancesFloat = Map<string, number>;
export type Balances = Map<string, BigNumber>;
export type SharesToAddresses = Map<
  string,
  { account: string; amount: BigNumber }
>;

export interface Page {
  skip: number;
  take: number;
}

/** Necessary and sufficient properties needed to derive the URI */
export interface CampaignUriDetails {
  creator: string;
  nonce: number;
  execDate: number;
  strategyID: Strategy_ID;
  strategyParams: Record<string, any>;
}

/** Editable campaign properties that are not part of the URI */
export interface CampaignCreateDetails {
  title: string;
  description: string;
  guardian: string;
  oracle: string;
  activationTime: number;
  CHALLENGE_PERIOD: number;
  ACTIVATION_PERIOD: number;
  ACTIVE_DURATION: number;
  chainId: number;
  asset: string;
  address: string;
}

export interface CampaignReadDetails
  extends CampaignCreateDetails,
    CampaignUriDetails {
  uri: string;
  title: string;
  description: string;
  guardian: string;
  oracle: string;
  chainId: number;
  address: string;
  registered: boolean;
  executed: boolean;
  published: boolean;
  creatorId: string | null;
}

export interface BalancesObject {
  [account: string]: string;
}

export interface SharesRead {
  uri: string;
  shares: BalancesObject;
  page: Page;
  total: number;
}

export interface Asset {
  id: string;
  address: string;
  decimals: number;
  name: string;
  icon: string;
}

export interface ChainAndAssets {
  chainIcon: string;
  chain: Chain;
  assets: Asset[];
}

/**
 * used to list the balances of a campaign contract and reused also
 * for sending the available claimable tokens for a given address on
 * a given campaign
 */
export interface TokenBalance extends Asset {
  balance: string;
  price?: number;
}

export interface RootDetails {
  order: number;
  uri: string;
  root: string;
  date: number;
  nLeafs: number;
}

export interface CampaignOnchainDetails {
  publishInfo?: PublishInfo;
  tokens?: TokenBalance[];
  root?: RootDetails;
}

export interface TreeClaimInfo {
  /** merkle root */
  root: string;
  /** address */
  address?: string;
  /** true if the address is present in the merkle root */
  present: boolean;
  /** proof for this address */
  proof?: string[];
  /** amount of shares available to the address */
  shares?: string;
  /** amount of assets available to the address (based on current campaign assets) */
  assets?: TokenBalance[];
}

export interface CampaignClaimInfo {
  campaignAddress?: string;
  /** true if the campaign was already executed  */
  executed: boolean;
  /** true if the campaign was already executed  */
  published: boolean;
  /** current claim info */
  current?: TreeClaimInfo;
  /** pending claim info */
  pending?: TreeClaimInfo;
  /** activation time for the pending claim */
  activationTime?: number;
}

export interface TimeDetails {
  now: number;
}

export interface PublishInfo {
  params: {
    challengePeriod: number;
    activationPeriod: number;
    activeDuration: number;
    deployTime: number;
  };
  status: {
    blockNumber: number;
    timestamp: number;
    approvedRoot: string;
    pendingRoot: string;
    validRoot: string;
    locked: boolean;
    activationTime: number;
    isProposeWindowActive: boolean;
  };
  derived?: {
    periodIx: number;
    nextWindowStarts: number;
    nextWindowEnds: number;
  };
}

export type StrategyFunc = (
  world: World,
  params: any
) => Promise<BalancesFloat>;

export type StrategyInfo = {
  name: string;
  description: string;
  exapmle_Params: any;
};

export type Strategy = {
  strategyFunc: StrategyFunc;
  strategyInfo: StrategyInfo;
};

export type { WorldConfig };
