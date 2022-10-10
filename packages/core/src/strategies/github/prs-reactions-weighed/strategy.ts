import { StrategyFunc } from '../../../types';
import { World } from '../../../world/World';
import {
  getPrsInRepo,
  getRepoContributors,
  getPullReactions,
  repoAvailable,
  toTimeStamp,
} from '../utils';

// Reactions that will count "thumbs up", "rocket", "heart" or "celebration"
const countReactions = ['+1', 'hooray', 'heart', 'rocket'];

export enum ReactionConfig {
  PRS_AND_REACTS = 'PRS_AND_REACTS',
  ONLY_PRS = 'ONLY_PRS',
  ONLY_REACTS = 'ONLY_REACTS',
}

export interface Params {
  repositories: Array<{ owner: string; repo: string }>;
  timeRange: { start: number; end: number };
  reactionsConfig: ReactionConfig;
}

const DEBUG = true;

export const strategyFunc: StrategyFunc = async (
  world: World,
  params: Params
) => {
  if (DEBUG) console.log('running pr-reactions-weighted', { params });

  if (params.timeRange.start >= params.timeRange.end) {
    throw new Error('time params incorrect: start must be smaller than end');
  }

  const pointsPerContributor = new Map<string, Array<number>>();
  const contributors = new Set<string>();

  // get all contributors in the repositories
  for (const repo of params.repositories) {
    // check once for every repo if available
    if (!(await repoAvailable(world, repo))) {
      throw new Error(`repo ${repo.owner}\\${repo.repo} is not available`);
    }

    const repoContributors = await getRepoContributors(world, repo);

    for (const contributor of repoContributors) {
      if (contributor.login != null && contributor.login !== undefined)
        contributors.add(contributor.login);
    }
  }

  if (DEBUG) console.log('contributors', { contributors });

  for (const repo of params.repositories) {
    // get all pulls that were merged at the specified time range
    const allPulls = await getPrsInRepo(world, repo, (pull) => {
      if (
        (pull.merged_at as string) != null &&
        params.timeRange.start <= toTimeStamp(pull.merged_at as string) &&
        params.timeRange.end >= toTimeStamp(pull.merged_at as string)
      ) {
        return true;
      } else {
        return false;
      }
    });

    if (DEBUG)
      console.log('allPulls:', { ids: allPulls.map((pull) => pull.number) });

    // get the amount of reactions on every pull request that was made by a contributor
    for (const pull of allPulls) {
      if (pull.user == null) {
        continue;
      }
      const pullCreator: string = pull.user.login;

      const points = await (async (): Promise<number> => {
        switch (params.reactionsConfig) {
          case ReactionConfig.ONLY_PRS:
            return 1;

          case ReactionConfig.ONLY_REACTS:
          case ReactionConfig.PRS_AND_REACTS:
            const reactions = await getPullReactions(world, repo, pull.number);

            if (DEBUG)
              console.log('reactions', {
                repo,
                number: pull.number,
                reactions,
              });

            const reacted = new Set<string>();
            reacted.add(pullCreator);

            let _points =
              params.reactionsConfig === ReactionConfig.PRS_AND_REACTS ? 1 : 0;

            for (const reaction of reactions) {
              if (
                reaction.user != null && // only reactions by users
                contributors.has(reaction.user.login) && // only reactions by contributors
                countReactions.includes(reaction.content) && // only reactions that count
                !reacted.has(reaction.user.login) // one reaction per contributor
              ) {
                _points += 1;
                reacted.add(reaction.user.login);
              }
            }
            return _points;
        }
      })();

      if (pointsPerContributor.has(pullCreator)) {
        pointsPerContributor.get(pullCreator)?.push(points);
      } else {
        pointsPerContributor.set(pullCreator, [points]);
      }
    }
  }

  if (DEBUG) console.log('pointsPerContributor', { pointsPerContributor });

  const scores = new Map();
  for (const [contributor, points] of pointsPerContributor.entries()) {
    const weight = Math.pow(
      points.reduce((partialSum, num) => partialSum + Math.pow(num, 2), 0),
      1 / 2
    );
    if (weight > 0) {
      scores.set(contributor, weight);
    }
  }

  // normalize the scores to percentage from the total amount of scores
  let scoresSum = 0;
  for (const score of scores.values()) {
    scoresSum += score;
  }

  for (const [contributor, score] of scores) {
    scores.set(contributor, (score / scoresSum) * 100);
  }

  if (DEBUG) console.log('scores', { scores });

  return scores;
};
