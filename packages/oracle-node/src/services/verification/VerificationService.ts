import { CrossVerification } from '@prisma/client';
import { Octokit } from 'octokit';
import { VerificationIntent, isSendRewards } from '@dao-strategies/core';

export class VerificationService {
  protected octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getVericationsGithub(
    github_username: string,
    intent: string
  ): Promise<Array<CrossVerification>> {
    const verifications: Array<CrossVerification> = [];

    const { data: gists } = await this.octokit.rest.gists.listForUser({
      username: github_username,
      per_page: 10,
    });

    /** check gist contents */
    for await (const gist of gists) {
      const { data: gistFull } = await this.octokit.rest.gists.get({
        gist_id: gist.id,
      });

      Object.values(gistFull.files).forEach((file) => {
        const sendRewards = isSendRewards(file.content);

        if (sendRewards) {
          verifications.push({
            from: `github:${github_username}`,
            to: `ethereum-${sendRewards.params.chain}:${sendRewards.params.address}`,
            intent: VerificationIntent.SEND_REWARDS,
            proof: gist.url,
          });
        }
      });
    }

    return verifications;
  }
}
