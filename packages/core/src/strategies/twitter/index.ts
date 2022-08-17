import { Strategy } from '../../types';

import { strategy as TW_RETWEETS } from './retweets/index';

export type TW_STRATEGY_ID = 'TW_RETWEETS';

export const twitter_strategies: Record<TW_STRATEGY_ID, Strategy> = {
    'TW_RETWEETS': TW_RETWEETS,
};
