import { Strategy } from '../../../types';

import { strategyInfo } from './info';
import { Params as ThisParams, strategyFunc } from './strategy';

export const strategy: Strategy = {
  strategyFunc: strategyFunc,
  strategyInfo: strategyInfo,
};

export type Params = ThisParams;
