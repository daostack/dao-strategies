import { StrategyID } from '@dao-strategies/core';
import { Campaign, Reward } from '@prisma/client';
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';

export interface CampaignUriDetails {
  creator: string;
  nonce: number;
  execData: number;
  strategyID: StrategyID;
  strategyParams: Object;
}

export const campaignToUriDetails = (campaign: Campaign): CampaignUriDetails => {
  return {
    creator: campaign.creatorId,
    execData: campaign.execDate,
    nonce: campaign.nonce,
    strategyID: campaign.stratID as StrategyID,
    strategyParams: JSON.parse(campaign.stratParamsStr).
  }
}

export const campaigToCampaignUri = (campaign: Campaign): Promise<string> => {
  return getCampaignUri(campaignToUriDetails(campaign));
}

export const getCampaignUri = async (
  campaignDetails: CampaignUriDetails
): Promise<string> => {
  const bytes = json.encode(campaignDetails);
  const hash = await sha256.digest(bytes);
  return CID.create(1, json.code, hash).toString();
};

export const getRewardUri = async (
  uri: string, account: string
): Promise<string> => {
  const bytes = Buffer.from(uri + account);
  return sha256.digest(bytes).toString();
}
