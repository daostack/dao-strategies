/* eslint-disable unused-imports/no-unused-vars-ts */
import {
  Balances,
  BalancesFloat,
  normalizeShares,
  IStrategyComputation,
} from '@dao-strategies/core';
import random from 'random';
import seedrandom from 'seedrandom';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
random.use(seedrandom('0001'));
const N = 10;

const userNames = Array.from(Array(N).keys()).map((e) => `github:user${e}`);
const randomShare = random.uniform(0, 1);

export class StrategyComputationMock implements IStrategyComputation {
  async runStrategy(strategyId: string, params: any): Promise<Balances> {
    const shares: BalancesFloat = new Map();

    userNames.forEach((user: string) => {
      shares.set(user, randomShare());
    });

    return Promise.resolve(normalizeShares(shares));
  }
}
