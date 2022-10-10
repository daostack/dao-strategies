import { StrategiesMap } from '../strategies.map';

import {
  strategy as GH_PRS_REACTIONS_WEIGHED,
  ReactionConfig,
} from './prs-reactions-weighed/index';

const github_strategies = new StrategiesMap();
github_strategies.addStrategy(GH_PRS_REACTIONS_WEIGHED);

export { github_strategies };

export { ReactionConfig };
