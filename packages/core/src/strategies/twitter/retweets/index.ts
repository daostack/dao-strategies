import { Strategy } from '../../../types';

import { strategyInfo } from './info';
import { strategyFunc } from './strategy';

export const strategy: Strategy = {
  strategyFunc: strategyFunc,
  strategyInfo: strategyInfo,
};
