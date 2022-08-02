import { strategies, Strategy_ID } from '../strategies';
import { normalizeShares } from '../support';
import { Balances } from '../types';
import { World, WorldConfig } from '../world/World';

export class StrategyComputation {
  protected world: World;

  constructor(config: WorldConfig) {
    this.world = new World(config);
  }

  async runStrategy(strategyId: Strategy_ID, params: any): Promise<Balances> {
    const shares = await strategies[strategyId].strategyFunc(
      this.world,
      params
    );
    return normalizeShares(shares);
  }
}
