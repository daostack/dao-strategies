import { ReadDataService } from './services/onchain/ReadDataService';
import { CampaignService } from './services/CampaignService';
import { SendTransactionService } from './services/onchain/SendTransactionsService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { IndexingService } from './services/onchain/IndexService';
import { providers, Signer } from 'ethers';

export interface Services {
  campaign: CampaignService;
  time: TimeService;
  user: UserService;
  socialApi: SocialApiService;
  readDataService: ReadDataService;
  indexingService: IndexingService;
  sendTransaction: SendTransactionService;
}
export interface ChainProvider {
  signer: Signer;
  provider: providers.Provider;
}
export type ChainProviders = Map<number, ChainProvider>;
