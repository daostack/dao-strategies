import { StrategiesMap } from '../strategies.map';

import { strategy as TW_RETWEETS } from './retweets/index';

const twitter_strategies = new StrategiesMap();
twitter_strategies.addStrategy(TW_RETWEETS);

export { twitter_strategies };
