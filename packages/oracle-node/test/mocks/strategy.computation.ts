/* eslint-disable unused-imports/no-unused-vars-ts */
import { Balances, Strategy_ID } from '@dao-strategies/core';
import { BigNumber } from 'ethers';

export const TEST_REWARDS = {
  user1: BigNumber.from('10000'),
};

export const StrategyComputationMockFunctions = {
  runStrategy: (strategyId: Strategy_ID, params: any): Promise<Balances> => {
    const balances: Balances = new Map();

    Object.getOwnPropertyNames(TEST_REWARDS).forEach((user: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      balances.set(user, TEST_REWARDS[user]);
    });
    return Promise.resolve(balances);
  },
};
