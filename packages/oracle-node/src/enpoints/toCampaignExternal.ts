import { Campaign } from '@prisma/client';
import { toNumber } from '../utils/utils';

/** should be the same as CampaignDetails in frontend */
interface CampaignExternal {
  uri: string;
  title: string;
  description: string;
  creator: string;
  guardian: string;
  oracle: string;
  chain: string;
  asset: string;
  execDate: number;
  cancelDate: number;
  strategyID: string;
  strategyParams: Record<string, any>;
  address: string;
}

export const toCampaignExternal = (campaign: Campaign): CampaignExternal => {
  const campaignExt: CampaignExternal = {
    uri: campaign.uri,
    title: campaign.title,
    description: campaign.description,
    creator: campaign.creatorId,
    guardian: campaign.guardian,
    oracle: campaign.oracle,
    chain: campaign.chain,
    asset: campaign.asset,
    execDate: toNumber(campaign.execDate),
    cancelDate: toNumber(campaign.cancelDate),
    strategyID: campaign.stratID,
    strategyParams: JSON.parse(campaign.stratParamsStr) as Record<string, any>,
    address: campaign.address,
  };

  return campaignExt;
};
