import { paginateRest } from '@octokit/plugin-paginate-rest';
import { Octokit } from 'octokit';
import { TwitterApi } from 'twitter-api-v2';

export interface WorldConfig {
  GITHUB_TOKEN: string;
  TWITTER_BEARER_TOKEN: string;
}

export class World {
  readonly github: Octokit;
  readonly twitter: TwitterApi;

  constructor(protected config: WorldConfig) {
    const MyOctokit = Octokit.plugin(paginateRest);
    this.github = new MyOctokit({ auth: config.GITHUB_TOKEN });
    this.twitter = new TwitterApi(config.TWITTER_BEARER_TOKEN);
  }
}
