import { StrategyComputation } from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';

import { CampaignRepository } from './repositories/CampaignRepository';
import { UserRepository } from './repositories/UserRepository';
import { CampaignService } from './services/CampaignService';
import { ExecuteService, ExecutionConfig } from './services/ExecutionService';
import { OnChainService } from './services/OnChainService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { Services } from './types';

export class ServiceManager {
  public client: PrismaClient;
  public campaignRepo: CampaignRepository;
  public userRepo: UserRepository;

  public strategyComputation: StrategyComputation;

  private timeService: TimeService;
  private onChainService: OnChainService;

  public services: Services;
  public execution: ExecuteService;

  constructor(config: ExecutionConfig) {
    this.client = new PrismaClient();

    this.campaignRepo = new CampaignRepository(this.client);
    this.userRepo = new UserRepository(this.client);

    this.strategyComputation = new StrategyComputation(config.world);
    this.timeService = new TimeService();
    this.onChainService = new OnChainService();

    this.services = {
      campaign: new CampaignService(
        this.campaignRepo,
        this.timeService,
        this.strategyComputation,
        this.onChainService
      ),
      user: new UserService(this.userRepo, config.world.GITHUB_TOKEN),
      time: this.timeService,
      onchain: this.onChainService,
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
