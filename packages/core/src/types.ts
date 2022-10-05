import { Chain } from '@wagmi/core';
import { BigNumber } from 'ethers';

import { World, WorldConfig } from './world/World';

export type BalancesFloat = Map<string, number>;
export type Balances = Map<string, BigNumber>;
export type SharesToAddresses = Map<
  string,
  { accounts: string[]; amount: BigNumber }
>;

export interface Page {
  number: number;
  perPage: number;
  total?: number;
  totalPages?: number;
}

/** Necessary and sufficient properties needed to derive the URI */
export interface CampaignUriDetails {
  creator: string;
  nonce: number;
  execDate: number;
  strategyID: string;
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
  customAssets: string[];
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
  valueLocked: number;
}

export interface SharesObject {
  [account: string]: {
    amount: string;
    address?: string;
  };
}

export interface SharesRead {
  uri: string;
  shares: SharesObject;
  page: Page;
  details?: CampaignUriDetails;
}

export interface Asset {
  id: string;
  address: string;
  decimals: number;
  name: string;
  icon?: string;
}

export interface ChainAndAssets {
  chainIcon: string;
  chain: Chain;
  assets: Asset[];
  explorer?: string;
  exploreAddress?: (address: string) => string;
  exploreTx?: (hash: string) => string;
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
  balances?: TokenBalance[];
  raised?: TokenBalance[];
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
  /** true if the campaign was already published  */
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

export type IDPlatform = 'github' | 'twitter';

export type StrategyFunc = (
  world: World,
  params: any
) => Promise<BalancesFloat>;

export type StrategyInfo<P = any> = {
  id: string;
  icon?: string;
  name: string;
  description: string;
  example_params: P;
  platform: IDPlatform;
};

export type Strategy = {
  func: StrategyFunc;
  info: StrategyInfo;
};

export type { WorldConfig };

export interface GithubProfile {
  handle: string;
  avatar_url: string;
  url: string;
  name?: string;
  bio?: string;
}

/** should be the same as Primsa.CrossVerification */
export interface Verification {
  from: string;
  to: string;
  intent: string;
  proof: string;
}

export interface LoggedUserDetails {
  address: string;
  verifications: Verification[];
}

export interface FundEventRead {
  uri: string;
  funder: string;
  blockNumber: number;
  timestamp: number;
  txHash: string;
  asset: TokenBalance;
}

export interface CampaignFunder {
  uri: string;
  funder: string;
  value: number;
  assets: TokenBalance[];
}

export interface CampaignFundersRead {
  uri: string;
  funders: CampaignFunder[];
  page: Page;
}
