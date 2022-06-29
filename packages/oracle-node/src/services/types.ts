export interface CampaignCreateDetails {
  registered: boolean;
  title: string;
  description: string;
  guardian: string;
  oracle: string;
  chain: string;
  asset: string;
  cancelDate: number;
  address: string;
}

export interface TokenBalances {
  [tokenName: string]: {
    address: string;
    balance: string;
  };
}

export interface CampaignOnchainDetails {
  tokens: TokenBalances;
}
