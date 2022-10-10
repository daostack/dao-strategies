import {
  ContractsJson,
  IStrategyComputation,
  StrategyComputation,
} from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';
import { providers } from 'ethers';
import { Wallet } from 'ethers/lib/ethers';
import { StrategyComputationMock } from '../test/mocks/strategy.computation';

import { chainConfig, PRICE_UPDATE_PERIOD, worldConfig } from './config';
import { appLogger } from './logger';
import { CampaignRepository } from './repositories/CampaignRepository';
import { IndexRepository } from './repositories/IndexRepository';
import { UserRepository } from './repositories/UserRepository';
import { CampaignService } from './services/CampaignService';
import { ExecuteService, ExecutionConfig } from './services/ExecutionService';
import { IndexingService } from './services/onchain/IndexService';
import { ReadDataService } from './services/onchain/ReadDataService';
import { SendTransactionService } from './services/onchain/SendTransactionsService';
import { PriceService } from './services/PriceService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { ChainProviders, Services } from './types';

// const LOG = ['query', 'info', 'warn', 'error'];
const LOG = ['warn', 'error'];

// const wallet = ethers.Wallet.createRandom();
// console.log('wallet', { privateKey: wallet.privateKey });

export class ServiceManager {
  public client: PrismaClient;

  public campaignRepo: CampaignRepository;
  public userRepo: UserRepository;
  public indexRepo: IndexRepository;

  public strategyComputation: IStrategyComputation;

  private userService: UserService;
  private timeService: TimeService;
  private sendTransactionService: SendTransactionService;
  private readDataService: ReadDataService;
  private socialApi: SocialApiService;
  private indexingService: IndexingService;
  private campaignService: CampaignService;
  private priceService: PriceService;

  private providers: ChainProviders;

  public services: Services;
  public execution: ExecuteService;

  constructor(config: ExecutionConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = new PrismaClient({ log: LOG as any });

    this.providers = new Map();

    ContractsJson.chainIds().forEach((chainId: number) => {
      const config = chainConfig.get(chainId);
      if (!config.privateKey) return;
      const provider = config.alchemyKey
        ? new providers.AlchemyProvider(config.chainName, config.alchemyKey)
        : new providers.JsonRpcProvider(config.url);

      let signer = new Wallet(config.privateKey);
      appLogger.info(
        `signer for chainId: ${chainId} - publicKey: ${signer.address}`
      );

      signer = signer.connect(provider);

      this.providers.set(chainId, { provider, signer });
    });

    this.campaignRepo = new CampaignRepository(this.client);
    this.userRepo = new UserRepository(this.client);
    this.indexRepo = new IndexRepository(this.client);

    this.strategyComputation =
      process.env.MOCK_STRATEGY_COMPUTATION?.toLocaleLowerCase() === 'true'
        ? new StrategyComputationMock()
        : new StrategyComputation(worldConfig);

    this.timeService = new TimeService();
    this.sendTransactionService = new SendTransactionService(this.providers);

    this.socialApi = new SocialApiService(config.world.GITHUB_TOKEN);

    this.userService = new UserService(
      this.userRepo,
      config.world.GITHUB_TOKEN
    );

    this.campaignService = new CampaignService(
      this.campaignRepo,
      this.timeService,
      this.userService,
      this.strategyComputation,
      this.sendTransactionService,
      { republishTimeMargin: config.republishTimeMargin }
    );

    this.priceService = new PriceService(
      this.client,
      this.timeService,
      PRICE_UPDATE_PERIOD
    );

    this.readDataService = new ReadDataService(
      this.campaignService,
      this.priceService,
      this.providers
    );

    this.indexingService = new IndexingService(
      this.indexRepo,
      this.campaignRepo,
      this.campaignService,
      this.readDataService,
      this.priceService,
      this.providers
    );

    this.campaignService.setOnChainRead(this.readDataService);
    this.campaignService.setIndexing(this.indexingService);

    this.services = {
      campaign: this.campaignService,
      user: this.userService,
      time: this.timeService,
      sendTransaction: this.sendTransactionService,
      socialApi: this.socialApi,
      readDataService: this.readDataService,
      indexingService: this.indexingService,
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
