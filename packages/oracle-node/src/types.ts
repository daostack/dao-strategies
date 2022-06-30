import { CampaignOnChainService } from './services/CampaignOnChainService';
import { CampaignService } from './services/CampaignService';
import { OnChainService } from './services/OnChainService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';

export interface Services {
  campaign: CampaignService;
  time: TimeService;
  user: UserService;
  onchain: OnChainService;
  socialApi: SocialApiService;
  campaignOnChain: CampaignOnChainService;
}
