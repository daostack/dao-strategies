import { Strategy } from '../../../types';

import { strategyInfo } from './info';
import { strategyFunc } from './strategy';

export const strategy: Strategy = {
  func: strategyFunc,
  info: strategyInfo,
};
