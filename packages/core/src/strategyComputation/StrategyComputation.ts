import { strategies } from '../strategies';
import { normalizeShares } from '../support';
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
    const shares = await strategies.get(strategyId)?.func(this.world, params);

    if (shares === undefined) {
      throw Error(`Strategy ${strategyId} not found`);
    }
    return normalizeShares(shares);
  }
}
