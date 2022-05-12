import { Octokit } from 'octokit';

export interface WorldConfig {
  GITHUB_TOKEN: string;
}

export class World {
  readonly github: Octokit;

  constructor(protected config: WorldConfig) {
    this.github = new Octokit({ auth: config.GITHUB_TOKEN });
  }
}
