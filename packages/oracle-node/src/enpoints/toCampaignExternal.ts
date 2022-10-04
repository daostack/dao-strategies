import { CampaignReadDetails, bigIntToNumber } from '@dao-strategies/core';
import { Campaign } from '@prisma/client';

export const toCampaignExternal = (campaign: Campaign): CampaignReadDetails => {
  const campaignExt: CampaignReadDetails = {
    ...campaign,
    logoUrl: campaign.logoUrl,
    creator: campaign.creatorId,
    execDate: bigIntToNumber(campaign.execDate),
    strategyID: campaign.stratID,
    strategyParams: JSON.parse(campaign.stratParamsStr) as Record<string, any>,
  };

  return campaignExt;
};
