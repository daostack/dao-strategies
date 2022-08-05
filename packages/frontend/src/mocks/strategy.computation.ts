import { Strategy_ID, SharesRead } from '@dao-strategies/core';

export const TEST_SHARES: SharesRead = {
  shares: { user1: '10000' },
  page: { number: 0, perPage: 10, total: 1 },
  uri: 'abc',
};

export const StrategyComputationMockFunctions = {
  runStrategy: async (strategyId: Strategy_ID, params: any): Promise<SharesRead> => {
    return TEST_SHARES;
  },
};
