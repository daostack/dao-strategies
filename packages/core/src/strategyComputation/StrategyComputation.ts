import { hashObject } from '../campaigns';
import { strategies } from '../strategies';
import { normalizeShares, renameIds } from '../support';
import { Balances } from '../types';
import { World, WorldConfig } from '../world/World';

export interface IStrategyComputation {
  runStrategy(strategyId: string, params: any): Promise<Balances>;
}

export class StrategyComputation implements IStrategyComputation {
  protected world: World;
  private running: Map<string, Promise<Balances>> = new Map();

  async getUnique(strategyId: string, params: any): Promise<string> {
    const hash = await hashObject(params);
    return `${strategyId}-${hash.digest.toString()}`;
  }

  constructor(config: WorldConfig) {
    this.world = new World(config);
  }

  async runStrategy(strategyId: string, params: any): Promise<Balances> {
    const unique = await this.getUnique(strategyId, params);

    const running = this.running.get(unique);
    if (running) {
      console.log('runStrategy - reentered', { strategyId, params });
      return running;
    }

    const run = (async (): Promise<Balances> => {
      const strategy = strategies.get(strategyId);

      if (strategy === undefined) {
        throw Error(`Strategy ${strategyId} not found`);
      }
      const shares = await strategy.func(this.world, params);

      return renameIds(normalizeShares(shares), strategy.info.platform);
    })();

    try {
      const res = await run;
      this.running.delete(unique);
      return res;
    } catch (e) {
      this.running.delete(unique);
      throw new Error(`Error running ${strategyId}`);
    }
  }
}
