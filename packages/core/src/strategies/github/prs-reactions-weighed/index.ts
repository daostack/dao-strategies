import { Strategy } from '../../../types';
import { World } from '../../../world/World';
import {
  getPrsInRepo,
  getRepoContributors,
  toTimeStamp,
  getPullReactions,
} from '../utils';

interface Params {
  repositories: Array<{ owner: string; repo: string }>;
  timeRange: { start: number; end: number };
}

const strategy: Strategy = async (world: World, params: Params) => {
  if (params.timeRange.start >= params.timeRange.end) {
    throw new Error('time params incorrect: start must be smaller than end');
  }

  const reactionsPerContributor = new Map<string, Array<number>>();
  const contributors = new Set<string>();

  // get all contributors in the repositories
  for (const repo of params.repositories) {
    const repoContributors = await getRepoContributors(world, repo);
    repoContributors.forEach(contributors.add, contributors);
  }

  for (const repo of params.repositories) {
    // get all pulls that were created and merged at the specified time range
    const allPulls = await getPrsInRepo(world, repo);
    const pullsFiltered = allPulls.filter(function (pull) {
      if (pull.merged_at == null) {
        return false;
      }
      return (
        toTimeStamp(pull.merged_at) >= params.timeRange.start &&
        toTimeStamp(pull.merged_at) <= params.timeRange.end
      );
    });

    // get the amount of reactions on every pull request that was made by a contributor
    for (const pull of pullsFiltered) {
      if (pull.user == null) {
        continue;
      }
      const pullCreator: string = pull.user.login;
      let reactionsNum = 1; // every pull has one default reaction
      const reactions = await getPullReactions(world, repo, pull.number);
      for (const reaction of reactions) {
        if (
          reaction.user !== null &&
          reaction.user.login !== undefined &&
          contributors.has(reaction.user?.login) && // only reactions by contributors
          reaction.content === '+1'
        ) {
          // only "thumbs up" reactions count
          reactionsNum += 1;
        }
      }

      if (reactionsPerContributor.has(pullCreator)) {
        reactionsPerContributor.get(pullCreator)?.push(reactionsNum);
      } else {
        reactionsPerContributor.set(pullCreator, [reactionsNum]);
      }
    }
  }

  const scores = new Map();
  for (const [contributor, reactions] of reactionsPerContributor.entries()) {
    const amount = Math.pow(
      reactions.reduce((partialSum, num) => partialSum + Math.pow(num, 2), 0),
      1 / 2
    );
    scores.set(contributor, amount);
  }

  return scores;
};

export type { Params };
export { strategy };
