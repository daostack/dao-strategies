import { Strategy_ID } from '@dao-strategies/core';
import { Campaign } from '@prisma/client';
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';

export interface CampaignUriDetails {
  creator: string;
  nonce: number;
  execDate: number;
  strategyID: Strategy_ID;
  strategyParams: Record<string, any>;
}

export const campaignToUriDetails = (
  campaign: Campaign
): CampaignUriDetails => {
  return {
    creator: campaign.creatorId,
    execDate: campaign.execDate as unknown as number,
    nonce: campaign.nonce,
    strategyID: campaign.stratID as Strategy_ID,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    strategyParams: JSON.parse(campaign.stratParamsStr),
  };
};

export const getCampaignUri = async (
  campaignDetails: CampaignUriDetails
): Promise<string> => {
  const bytes = json.encode(campaignDetails);
  const hash = await sha256.digest(bytes);
  return CID.create(1, json.code, hash).toString();
};

export const campaigToCampaignUri = (campaign: Campaign): Promise<string> => {
  return getCampaignUri(campaignToUriDetails(campaign));
};

export const getRewardUri = async (
  uri: string,
  account: string
): Promise<string> => {
  const bytes = Buffer.from(uri + account);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash).toString();
};
