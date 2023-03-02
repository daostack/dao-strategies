import { StrategyInfo } from '../../../types';

import { Params, ReactionConfig } from './strategy';

export const strategyInfo: StrategyInfo<Params> = {
  id: 'GH_PRS_REACTIONS_WEIGHTED',
  icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  name: 'Github Contributors - PRs Weighted By Reactions',
  description:
    'Strategy description, including description regarding the configurable parameters and the strategy logic',
  example_params: {
    repositories: [
      {
        owner: 'dotansimha',
        repo: 'graphql-yoga',
      },
    ],
    reactionsConfig: ReactionConfig.PRS_AND_REACTS,
    timeRange: {
      start: 1651400578,
      end: 1653215165,
    },
    filters: ['bot$', '[bot]$'],
  },
  platform: 'github',
};
