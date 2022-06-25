import { Strategy_ID } from '@dao-strategies/core';
import { RewardsMap } from '../pages/campaign.support';

export const TEST_REWARDS: RewardsMap = {
  user1: '10000',
};

export const StrategyComputationMockFunctions = {
  runStrategy: async (strategyId: Strategy_ID, params: any): Promise<RewardsMap> => {
    return TEST_REWARDS;
  },
};
