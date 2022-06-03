import { StrategyComputation } from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';

import { worldConfig } from './config';
import { CampaignRepository } from './repositories/CampaignRepository';
import { UserRepository } from './repositories/UserRepository';
import { CampaignService } from './services/CampaignService';
import { ExecuteService } from './services/ExecutionService';
import { TimeService } from './services/TimeService';
import { UserService } from './services/UserService';
import { Services } from './types';

export class ServiceManager {
  public client: PrismaClient;
  public campaignRepo: CampaignRepository;
  public userRepo: UserRepository;

  public strategyComputation: StrategyComputation;
  private timeService: TimeService;

  public services: Services;
  public execution: ExecuteService;

  constructor(enabled: boolean = false) {
    this.client = new PrismaClient();

    this.campaignRepo = new CampaignRepository(this.client);
    this.userRepo = new UserRepository(this.client);

    this.strategyComputation = new StrategyComputation(worldConfig);
    this.timeService = new TimeService();

    this.services = {
      campaign: new CampaignService(
        this.campaignRepo,
        this.timeService,
        this.strategyComputation
      ),
      time: this.timeService,
      user: new UserService(this.userRepo, worldConfig.GITHUB_TOKEN),
    };

    this.execution = new ExecuteService(this.services, enabled);
  }

  async resetDB(): Promise<void> {
    await this.client.$executeRaw`
      TRUNCATE public."Campaign", public."User", public."Reward";
    `;
  }
}
