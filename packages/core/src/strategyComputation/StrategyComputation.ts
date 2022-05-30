import { strategies, Strategy_ID } from '../strategies';
import { normalizeRewards } from '../support';
import { Balances } from '../types';
import { World, WorldConfig } from '../world/World';

export class StrategyComputation {
  protected world: World;

  constructor(config: WorldConfig) {
    this.world = new World(config);
  }

  async runStrategy(strategyId: Strategy_ID, params: any): Promise<Balances> {
    const rewards = await strategies[strategyId].strategyFunc(this.world, params);
    return normalizeRewards(rewards);
  }
}
