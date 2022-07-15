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

export interface ClaimInfo {
  executed: boolean;
  present: boolean;
  account?: string;
  campaignAddress?: string;
  shares?: string;
  assets?: TokenBalance[];
}

export interface TimeDetails {
  now: number;
}
