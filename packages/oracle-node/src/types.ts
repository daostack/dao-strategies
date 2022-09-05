import { ReadDataService } from './services/onchain/ReadDataService';
import { CampaignService } from './services/CampaignService';
import { SendTransactionService } from './services/onchain/SendTransactionsService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';

export interface Services {
  campaign: CampaignService;
  time: TimeService;
  user: UserService;
  socialApi: SocialApiService;
  readDataService: ReadDataService;
  sendTransaction: SendTransactionService;
}
