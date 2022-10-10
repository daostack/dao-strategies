import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import { World } from '../../world/World';

type PullRequestListData =
  RestEndpointMethodTypes['pulls']['list']['response']['data'];

type ReactionsListData =
  RestEndpointMethodTypes['reactions']['listForIssue']['response']['data'];

type ContributorsListData =
  RestEndpointMethodTypes['repos']['listContributors']['response']['data'];

const DEBUG = true;

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
  filter?: (pull: any) => boolean
): Promise<PullRequestListData> {
  const allPulls: PullRequestListData = [];

  const firstReq = await world.github.rest.pulls.list({
    ...repo,
    state: 'all',
    per_page: 100,
  });

  if (firstReq.headers.link === undefined) {
    // no pagination needed
    firstReq.data.forEach((pull) => {
      if (filter !== undefined) {
        // filter pull requests
        if (filter(pull)) {
          allPulls.push(pull);
        }
      } else {
        allPulls.push(pull);
      }
    });
  } else {
    const numPagesReg = firstReq.headers.link?.match(
      /<.*page=(\d+).*>; rel="last"/
    );
    if (numPagesReg !== undefined && numPagesReg != null) {
      const numPages: number = Number(numPagesReg[1]);
      if (DEBUG) console.log('numPages', { numPages, repo });

      const reqs = [];
      reqs.push(firstReq);

      for (let i = 2; i < numPages; i++) {
        reqs.push(async () => {
          if (DEBUG)
            console.log('rest.pulls.list - getting...', { repo, page: i });

          const prs = await world.github.rest.pulls.list({
            ...repo,
            state: 'all',
            per_page: 100,
            page: i,
          });

          if (DEBUG)
            console.log('rest.pulls.list - done...', {
              repo,
              page: i,
              prs,
            });

          return prs;
        });
      }

      await Promise.all(reqs).then((responses) => {
        for (const response of responses) {
          /* eslint-disable */
          for (const pull of (response as any).data) {
            if (filter !== undefined) {
              // filter pull requests
              if (filter(pull)) {
                (allPulls as any).push(pull);
              }
            } else {
              (allPulls as any).push(pull);
            }
          }
          /* eslint-enable */
        }
      });
    } else {
      throw new Error('Error: cannot paginate all pull requests');
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
  if (DEBUG) console.log('getRepoContributors - getting...', { repo });

  for await (const { data: contibutors } of iterator) {
    for (const contibutor of contibutors) {
      allContributors.push(contibutor);
    }
  }

  if (DEBUG)
    console.log('getRepoContributors - done...', {
      repo,
      n: allContributors.length,
    });

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
