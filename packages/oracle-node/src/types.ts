import { CampaignService } from './services/CampaignService';

export interface Services {
  campaign: CampaignService;
  time: TimeService;
}
