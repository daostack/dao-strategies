import { StrategyInfo } from '../../../types';

import { Params } from './strategy';

export const strategyInfo: StrategyInfo<Params> = {
  id: 'GH_PRS_REACTIONS_WEIGHTED',
  icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  name: 'Github Contributors - PRs Weighted By Reactions',
  description:
    'Strategy description, including description regarding the configurable parameters and the strategy logic',
  example_params: {
    repositories: [
      {
        owner: 'ethereum',
        repo: 'go-ethereum',
      },
    ],
    timeRange: {
      start: 1651400578,
      end: 1653215165,
    },
  },
};
