import { Strategy } from '../../types';

import * as GH_PRS_REACTIONS_WEIGHED from './prs-reactions-weighed';

export type GH_STRATEGY_ID = 'GH_PRS_REACTIONS_WEIGHED';

export const github_strategies: Record<GH_STRATEGY_ID, Strategy> = {
  GH_PRS_REACTIONS_WEIGHED: GH_PRS_REACTIONS_WEIGHED.strategy,
};
