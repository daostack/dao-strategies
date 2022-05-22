import { Strategy } from '../../../types';
import { World } from '../../../world/World';
import {
  getPrsInRepo,
  getRepoContributors,
  toTimeStamp,
  getPullReactions,
  repoAvailable
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
  let contributors = new Set<string>();

  // get all contributors in the repositories
  for (const repo of params.repositories) {
    // check once for every repo if available
    if (!(await repoAvailable(world, repo))) {
      throw new Error(`repo ${repo.owner}\\${repo.repo} is not available`);
    }

    const repoContributors = await getRepoContributors(world, repo);
    for (const contributor of repoContributors) {
      if (contributor.login != null && contributor.login != undefined)
        contributors.add(contributor.login);
    }
  }

  for (const repo of params.repositories) {
    // get all pulls that were merged at the specified time range
    const allPulls = await getPrsInRepo(world, repo, params.timeRange.start, params.timeRange.end);

    // get the amount of reactions on every pull request that was made by a contributor
    for (const pull of allPulls) {
      if (pull.user == null) {
        continue;
      }
      const pullCreator: string = pull.user.login;
      let reactionsNum = 1;
      const reactions = await getPullReactions(world, repo, pull.number);
      const reacted = new Set<string>();
      reacted.add(pullCreator);
      for (const reaction of reactions) {
        if (
          reaction.user != null && // only reactions by users
          contributors.has(reaction.user.login) && // only reactions by contributors
          (reaction.content == '+1' ||
            reaction.content == 'hooray' ||
            reaction.content == 'heart' ||
            reaction.content == 'rocket') && // only "thumbs up", "rocket", "heart" or "celebration" reactions 
          !reacted.has(reaction.user.login) // one reaction per contributor
        ) {
          reactionsNum += 1;
          reacted.add(reaction.user.login);
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
    scores.set(
      contributor,
      Math.pow(
        reactions.reduce((partialSum, num) => partialSum + Math.pow(num, 2), 0),
        1 / 2
      )
    );
  }

  // normalize the scores to percentage from the total amount of scores
  let scoresSum = 0;
  for (const score of scores.values()) {
    scoresSum += score;
  }
  for (const [contributor, score] of scores) {
    scores.set(contributor, (score / scoresSum) * 100);
  }

  return scores;
};

export type { Params };
export { strategy };
