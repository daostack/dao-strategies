import {
  StrategyComputation,
  IStrategyComputation,
} from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';
import { Signer, providers } from 'ethers';

import { StrategyComputationMock } from '../test/mocks/strategy.computation';

import { PRICE_UPDATE_PERIOD } from './config';
import { CampaignRepository } from './repositories/CampaignRepository';
import { UserRepository } from './repositories/UserRepository';
import { CampaignService } from './services/CampaignService';
import { ReadDataService } from './services/onchain/ReadDataService';
import { SendTransactionService } from './services/onchain/SendTransactionsService';
import { PriceService } from './services/PriceService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { Services } from './types';

import { ExecuteService, ExecutionConfig } from './services/ExecutionService';
import { IndexingService } from './services/onchain/IndexService';
import { IndexRepository } from './repositories/IndexRepository';
import { Wallet } from 'ethers/lib/ethers';

// const LOG = ['query', 'info', 'warn', 'error'];
const LOG = ['warn', 'error'];

export class ServiceManager {
  public client: PrismaClient;

  public campaignRepo: CampaignRepository;
  public userRepo: UserRepository;
  public indexRepo: IndexRepository;

  public strategyComputation: IStrategyComputation;

  private timeService: TimeService;
  private sendTransactionService: SendTransactionService;
  private readDataService: ReadDataService;
  private socialApi: SocialApiService;
  private indexingService: IndexingService;
  private campaignService: CampaignService;
  private priceService: PriceService;

  private provider: providers.Provider;
  private signer: Signer;

  public services: Services;
  public execution: ExecuteService;

  constructor(config: ExecutionConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = new PrismaClient({ log: LOG as any });

    this.provider = new providers.JsonRpcProvider(process.env.JSON_RPC_URL);
    this.signer = new Wallet(process.env.ORACLE_PRIVATE_KEY);
    this.signer = this.signer.connect(this.provider);

    this.campaignRepo = new CampaignRepository(this.client);
    this.userRepo = new UserRepository(this.client);
    this.indexRepo = new IndexRepository(this.client);

    this.strategyComputation = new StrategyComputationMock();
    // this.strategyComputation = new StrategyComputation();

    this.timeService = new TimeService();
    this.sendTransactionService = new SendTransactionService(
      this.signer,
      this.provider
    );

    this.socialApi = new SocialApiService(config.world.GITHUB_TOKEN);

    this.campaignService = new CampaignService(
      this.campaignRepo,
      this.timeService,
      this.strategyComputation,
      this.sendTransactionService,
      { republishTimeMargin: config.republishTimeMargin }
    );

    this.indexingService = new IndexingService(
      this.indexRepo,
      this.campaignService,
      this.provider
    );

    this.priceService = new PriceService(
      this.client,
      this.timeService,
      PRICE_UPDATE_PERIOD
    );

    this.readDataService = new ReadDataService(
      this.campaignService,
      this.indexingService,
      this.priceService,
      this.provider
    );

    this.campaignService.setOnChainRead(this.readDataService);

    this.services = {
      campaign: this.campaignService,
      user: new UserService(this.userRepo, config.world.GITHUB_TOKEN),
      time: this.timeService,
      sendTransaction: this.sendTransactionService,
      socialApi: this.socialApi,
      readDataService: this.readDataService,
    };

    this.execution = new ExecuteService(this.services, config);
  }

  /** for testing only */
  async resetDB(): Promise<void> {
    await this.client.$executeRaw`
      TRUNCATE 
        public."Campaign", 
        public."User", 
        public."Share", 
        public."CampaignRoot", 
        public."BalanceLeaf", 
        public."AssetPrice";
    `;
  }
}
