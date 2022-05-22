import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { World } from '../../world/World';

type PullRequestListData =
  RestEndpointMethodTypes['pulls']['list']['response']['data'];

type ReactionsListData =
  RestEndpointMethodTypes['reactions']['listForIssue']['response']['data'];

type ContributorsListData =
  RestEndpointMethodTypes['repos']['listContributors']['response']['data'];


export async function repoAvailable(
  world: World,
  repo: { owner: string; repo: string }
): Promise<boolean> {
  try {
    await world.github.rest.repos.get({ ...repo });
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
}

export async function getPrsInRepo(
  world: World,
  repo: { owner: string; repo: string },
  mergedFrom?: number,
  mergedTo?: number
): Promise<PullRequestListData> {
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
      if (mergedFrom != undefined && mergedTo != undefined && mergedFrom < mergedTo) { // if filter by merge time
        if (
          pull.merged_at != null &&
          mergedFrom <= toTimeStamp(pull.merged_at) &&
          mergedTo >= toTimeStamp(pull.merged_at)) {
          allPulls.push(pull);;
        }
      }
      else {
        allPulls.push(pull);
      }
    }
  }

  return allPulls;
}

export async function getRepoContributors(
  world: World,
  repo: { owner: string; repo: string }
): Promise<ContributorsListData> {
  const allContributors: ContributorsListData = [];
  const iterator = world.github.paginate.iterator(
    world.github.rest.repos.listContributors,
    {
      ...repo,
      per_page: 100,
    }
  );

  // iterate through each response
  for await (const { data: contibutors } of iterator) {
    for (const contibutor of contibutors) {
      allContributors.push(contibutor);
    }
  }

  return allContributors;
}

export async function getPullReactions(
  world: World,
  repo: { owner: string; repo: string },
  pullNum: number
): Promise<ReactionsListData> {
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
