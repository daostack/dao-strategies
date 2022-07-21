import { Strategy_ID } from '../strategies';

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
  chainId: number;
  asset: string;
  address: string;
  cancelDate: number;
}

export interface CampaignReadDetails
  extends CampaignCreateDetails,
    CampaignUriDetails {
  uri: string;
  registered: boolean;
  executed: boolean;
}

/**
 * used to list the balances of a campaign contract and reused also
 * for sending the available claimable tokens for a given address on
 * a given campaign
 */
export interface TokenBalance {
  id: string;
  address: string;
  balance: string;
  name: string;
  icon: string;
  proof?: string[];
}

export interface CampaignOnchainDetails {
  tokens: TokenBalance[];
}

export interface TreeClaimInfo {
  /** merkle root */
  root: string;
  /** address */
  address?: string;
  /** true if the address is present in the merkle root */
  present: boolean;
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
