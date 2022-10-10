import { Strategy } from '../../../types';

import { strategyInfo } from './info';
import { Params as ThisParams, strategyFunc } from './strategy';

export const strategy: Strategy = {
  func: strategyFunc,
  info: strategyInfo,
};

export type Params = ThisParams;
