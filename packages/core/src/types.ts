import { BigNumber } from 'ethers';

import { World, WorldConfig } from './world/World';

export type Balances = Map<string, BigNumber>;

export type Strategy = (world: World, params: any) => Promise<Balances>;

export type { WorldConfig };
