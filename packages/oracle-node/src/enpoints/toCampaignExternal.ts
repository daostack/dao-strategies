import { CampaignReadDetails, Strategy_ID } from '@dao-strategies/core';
import { Campaign } from '@prisma/client';

import { toNumber } from '../utils/utils';

export const toCampaignExternal = (campaign: Campaign): CampaignReadDetails => {
  const campaignExt: CampaignReadDetails = {
    ...campaign,
    creator: campaign.creatorId,
    execDate: toNumber(campaign.execDate),
    cancelDate: toNumber(campaign.cancelDate),
    strategyID: campaign.stratID as Strategy_ID,
    strategyParams: JSON.parse(campaign.stratParamsStr) as Record<string, any>,
  };

  return campaignExt;
};
