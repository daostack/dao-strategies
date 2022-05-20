import { BigNumber } from 'ethers';

import { World, WorldConfig } from './world/World';

export type BalancesFloat = Map<string, number>;
export type Balances = Map<string, BigNumber>;

export type Strategy = (world: World, params: any) => Promise<BalancesFloat>;

export type { WorldConfig };
