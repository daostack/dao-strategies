import { CampaignService } from './services/CampaignService';
import { OnChainService } from './services/OnChainService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';

export interface Services {
  campaign: CampaignService;
  time: TimeService;
  user: UserService;
  onchain: OnChainService;
}
