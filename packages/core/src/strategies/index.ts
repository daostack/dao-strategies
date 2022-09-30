import { github_strategies } from './github';
import { StrategiesMap } from './strategies.map';
import { twitter_strategies } from './twitter';

const strategies = new StrategiesMap();

strategies.merge(github_strategies);
strategies.merge(twitter_strategies);

export { strategies };
