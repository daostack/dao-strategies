import { Strategy_ID, SharesRead } from '@dao-strategies/core';

export const TEST_SHARES: SharesRead = {
  user1: '10000',
};

export const StrategyComputationMockFunctions = {
  runStrategy: async (strategyId: Strategy_ID, params: any): Promise<SharesRead> => {
    return TEST_SHARES;
  },
};
