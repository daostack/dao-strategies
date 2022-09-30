import { strategies } from '../strategies';
import { normalizeShares, renameIds } from '../support';
import { Balances } from '../types';
import { World, WorldConfig } from '../world/World';

export interface IStrategyComputation {
  runStrategy(strategyId: string, params: any): Promise<Balances>;
}

export class StrategyComputation implements IStrategyComputation {
  protected world: World;

  constructor(config: WorldConfig) {
    this.world = new World(config);
  }

  async runStrategy(strategyId: string, params: any): Promise<Balances> {
    const strategy = strategies.get(strategyId);
    if (strategy === undefined) {
      throw Error(`Strategy ${strategyId} not found`);
    }
    const shares = await strategy.func(this.world, params);

    return renameIds(normalizeShares(shares), strategy.info.platform);
  }
}
