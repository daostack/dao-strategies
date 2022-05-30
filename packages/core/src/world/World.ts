import { Octokit } from 'octokit';
import { paginateRest } from "@octokit/plugin-paginate-rest";

export interface WorldConfig {
  GITHUB_TOKEN: string;
}

export class World {
  readonly github: Octokit;

  constructor(protected config: WorldConfig) {
    const MyOctokit = Octokit.plugin(paginateRest);
    this.github = new MyOctokit({ auth: config.GITHUB_TOKEN });
  }
}
