import { BigNumber } from 'ethers';

import { World, WorldConfig } from './world/World';

export type BalancesFloat = Map<string, number>;
export type Balances = Map<string, BigNumber>;

export type StrategyFunc = (world: World, params: any) => Promise<BalancesFloat>;

export type StrategyInfo = {
    name: string,
    description: string,
    exapmle_Params: any
}

export type Strategy = {
    strategyFunc: StrategyFunc,
    strategyInfo: StrategyInfo
}

export type { WorldConfig };