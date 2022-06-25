import { Octokit } from 'octokit';

export class SocialApiService {
  protected octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async searchGithub(
    what: 'repos' | 'users',
    query: string,
    page: number,
    per_page: number
  ): Promise<string[]> {
    switch (what) {
      case 'repos':
        const repos = await this.octokit.rest.search.repos({
          q: `${query} in:name`,
          page,
          per_page,
        });
        return repos.data.items.map((item) => item.full_name);

      case 'users':
        const users = await this.octokit.rest.search.users({
          q: `${query} in:name`,
          page,
          per_page,
        });
        return users.data.items.map((item) => item.login);
    }
  }

  async repoIsValid(fullName: string): Promise<boolean> {
    const [owner, repo] = fullName.split('/');
    try {
      await this.octokit.rest.repos.get({ owner, repo });
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
