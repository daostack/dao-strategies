import { Strategy } from '../types';

import { github_strategies, GH_STRATEGY_ID } from './github';
import { twitter_strategies, TW_STRATEGY_ID } from './twitter'

export type Strategy_ID = GH_STRATEGY_ID | TW_STRATEGY_ID;

export const strategies: Record<Strategy_ID, Strategy> = {
  ...github_strategies,
  ...twitter_strategies
};
