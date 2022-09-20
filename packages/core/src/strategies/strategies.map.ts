import { Strategy } from '../types';

export class StrategiesMap {
  readonly strategies: Map<string, Strategy>;

  constructor() {
    this.strategies = new Map();
  }

  addStrategy(strategy: Strategy): void {
    if (this.strategies.has(strategy.info.id)) {
      throw new Error(`Strategy ${strategy.info.id} already added`);
    }
    this.strategies.set(strategy.info.id, strategy);
  }

  merge(_strategies: StrategiesMap): void {
    _strategies.list().map((strategy) => {
      this.addStrategy(strategy);
    });
  }

  get(id: string): Strategy | undefined {
    return this.strategies.get(id);
  }

  list(): Strategy[] {
    return Array.from(this.strategies.values());
  }
}
