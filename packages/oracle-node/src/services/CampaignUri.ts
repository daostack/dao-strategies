import { getCampaignUri, CampaignUriDetails } from '@dao-strategies/core';
import { Campaign } from '@prisma/client';

export const campaignToUriDetails = (
  campaign: Campaign
): CampaignUriDetails => {
  return {
    creator: campaign.creatorId,
    execDate: campaign.execDate as unknown as number,
    nonce: campaign.nonce,
    strategyID: campaign.stratID,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    strategyParams: JSON.parse(campaign.stratParamsStr),
  };
};

export const campaigToCampaignUri = (campaign: Campaign): Promise<string> => {
  return getCampaignUri(campaignToUriDetails(campaign));
};
