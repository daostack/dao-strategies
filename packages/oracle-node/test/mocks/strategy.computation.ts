/* eslint-disable unused-imports/no-unused-vars-ts */
import { Balances, Strategy_ID } from '@dao-strategies/core';
import { BigNumber } from 'ethers';

export const StrategyComputationMockFunctions = {
  runStrategy: (strategyId: Strategy_ID, params: any): Promise<Balances> => {
    const balances: Balances = new Map();
    balances.set('user1', BigNumber.from('10000'));
    return Promise.resolve(balances);
  },
};
