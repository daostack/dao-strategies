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

export const initServices = (): {
  services: Services;
  execution: ExecuteService;
} => {
  const client = new PrismaClient();

  const campaignRepo = new CampaignRepository(client);
  const userRepo = new UserRepository(client);

  const strategyComputation = new StrategyComputation(worldConfig);
  const timeService = new TimeService();

  const services: Services = {
    campaign: new CampaignService(
      campaignRepo,
      timeService,
      strategyComputation
    ),
    time: new TimeService(),
    user: new UserService(userRepo, worldConfig.GITHUB_TOKEN),
  };

  const execution = new ExecuteService(services);
  return { services, execution };
};
