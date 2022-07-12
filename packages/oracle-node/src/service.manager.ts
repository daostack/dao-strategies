import { StrategyComputation } from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';

import { CampaignRepository } from './repositories/CampaignRepository';
import { UserRepository } from './repositories/UserRepository';
import { CampaignOnChainService } from './services/CampaignOnChainService';
import { CampaignService } from './services/CampaignService';
import { ExecuteService, ExecutionConfig } from './services/ExecutionService';
import { OnChainService } from './services/OnChainService';
import { SocialApiService } from './services/SocialApiService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { Services } from './types';

// const LOG = ['query', 'info', 'warn', 'error'];
const LOG = ['warn', 'error'];

export class ServiceManager {
  public client: PrismaClient;
  public campaignRepo: CampaignRepository;
  public userRepo: UserRepository;

  public strategyComputation: StrategyComputation;

  private timeService: TimeService;
  private onChainService: OnChainService;
  private campaignOnChain: CampaignOnChainService;
  private socialApi: SocialApiService;
  private campaignService: CampaignService;

  public services: Services;
  public execution: ExecuteService;

  constructor(config: ExecutionConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = new PrismaClient({ log: LOG as any });

    this.campaignRepo = new CampaignRepository(this.client);
    this.userRepo = new UserRepository(this.client);

    this.strategyComputation = new StrategyComputation(config.world);
    this.timeService = new TimeService();
    this.onChainService = new OnChainService();

    this.socialApi = new SocialApiService(config.world.GITHUB_TOKEN);

    this.campaignService = new CampaignService(
      this.campaignRepo,
      this.timeService,
      this.strategyComputation,
      this.onChainService
    );

    this.campaignOnChain = new CampaignOnChainService(this.campaignService);

    this.services = {
      campaign: this.campaignService,
      user: new UserService(this.userRepo, config.world.GITHUB_TOKEN),
      time: this.timeService,
      onchain: this.onChainService,
      socialApi: this.socialApi,
      campaignOnChain: this.campaignOnChain,
    };

    this.execution = new ExecuteService(this.services, config);
  }

  /** for testing only */
  async resetDB(): Promise<void> {
    await this.client.$executeRaw`
      TRUNCATE public."Campaign", public."User", public."Reward";
    `;
  }
}
