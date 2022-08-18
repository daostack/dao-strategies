import { StrategyFunc } from '../../../types';
import { World } from '../../../world/World';
import { getTweetRetweeters } from '../utils';

interface Params {
  tweetId: string;
}

export const strategyFunc: StrategyFunc = async (
  world: World,
  params: Params
) => {
  const usersRetweeted = await getTweetRetweeters(world, params.tweetId);

  const scores = new Map<string, number>();
  const scoresSum = usersRetweeted.length;
  for (const user of usersRetweeted) {
    scores.set(user, (1 / scoresSum) * 100);
  }

  return scores;
};
