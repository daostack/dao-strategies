import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { World } from '../../world/World';

type PullRequestListData =
  RestEndpointMethodTypes['pulls']['list']['response']['data'];

type ReactionsListData =
  RestEndpointMethodTypes['reactions']['listForIssue']['response']['data'];

/*
todo: get typing for the pulls. Tries using PullRequestParams but the type is not compatible with the returned pulls 
from the iterator.
https://github.com/octokit/plugin-rest-endpoint-methods.js#typescript 
*/

export async function repoAvailable(
  world: World,
  repo: { owner: string; repo: string }
): Promise<boolean> {
  try {
    await world.github.rest.repos.get({ ...repo });
  } catch (e) {
    return false;
  }

  return true;
}

export async function getPrsInRepo(
  world: World,
  repo: { owner: string; repo: string }
): Promise<PullRequestListData> {
  if (!(await repoAvailable(world, repo))) {
    throw new Error(`repo ${repo.owner}\\${repo.repo} is not available`);
  }

  const allPulls: PullRequestListData = [];
  const iterator = world.github.paginate.iterator(
    world.github.rest.pulls.list,
    {
      ...repo,
      state: 'all',
      per_page: 100,
    }
  );

  // iterate through each response
  for await (const { data: pulls } of iterator) {
    for (const pull of pulls) {
      allPulls.push(pull);
    }
  }

  return allPulls;
}

export async function getRepoContributors(
  world: World,
  repo: { owner: string; repo: string }
): Promise<Set<string>> {
  if (!(await repoAvailable(world, repo))) {
    throw new Error(`repo ${repo.owner}\\${repo.repo} is not available`);
  }

  const response = await world.github.rest.repos.listContributors({ ...repo });

  if (response.status !== 200) {
    throw new Error(
      `github api get request for contributors in repo ${repo.owner}\\${repo.repo} failed`
    );
  }

  const set = new Set<string>();
  response.data.forEach((contributorData) => {
    if (contributorData.login !== undefined) {
      set.add(contributorData.login);
    }
  });

  return set;
}

export async function getPullReactions(
  world: World,
  repo: { owner: string; repo: string },
  pullNum: number
): Promise<ReactionsListData> {
  if (!(await repoAvailable(world, repo))) {
    throw new Error(`repo ${repo.owner}\\${repo.repo} is not available`);
  }

  const response = await world.github.rest.reactions.listForIssue({
    ...repo,
    issue_number: pullNum,
  });

  if (response.status !== 200) {
    throw new Error(
      `github api get request for pull request number ${pullNum} in repo ${repo.owner}\\${repo.repo} failed`
    );
  }
  return response.data;
}

export function toTimeStamp(date: string): any {
  return new Date(date).getTime() / 1000;
}
