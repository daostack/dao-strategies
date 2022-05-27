import { Prisma, User } from '@prisma/client';
import { Octokit } from 'octokit';

import { UserRepository } from '../repositories/UserRepository';

export interface UserCreateDetails {
  address: string;
}

export interface LoggedUserDetails {
  address: string;
  verified: {
    github: string;
  };
}

export class UserService {
  protected octokit: Octokit;

  constructor(protected userRepo: UserRepository, token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async exist(address: string): Promise<boolean> {
    return this.userRepo.exist(address.toLowerCase());
  }

  async get(address: string): Promise<User | undefined> {
    return this.userRepo.get(address.toLowerCase());
  }

  /** Sensitive method, call only after signature has been verified. */
  async getOrCreate(details: UserCreateDetails): Promise<User> {
    const exist = await this.exist(details.address);

    if (!exist) {
      const createData: Prisma.UserCreateInput = {
        address: details.address.toLowerCase(),
        github: '',
      };

      return this.create(createData);
    }

    return this.get(details.address);
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.userRepo.create(details);
  }

  async verifyGithub(gihub_username: string): Promise<{ valid: boolean }> {
    const { data: gists } = await this.octokit.rest.gists.listForUser({
      username: gihub_username,
      per_page: 3,
    });

    const ethAddressRegex = new RegExp('0x[a-fA-F0-9]{40}');
    let readAddress: string | undefined = undefined;

    /** check gist contents */
    for await (const gist of gists) {
      const { data: gistFull } = await this.octokit.rest.gists.get({
        gist_id: gist.id,
      });

      Object.values(gistFull.files).forEach((file) => {
        const found = ethAddressRegex.exec(file.content);
        if (found.length > 0) {
          readAddress = found[0].toString();
        }
      });

      /** must be verified by the logged user */
      if (readAddress !== undefined) {
        break;
      }
    }

    const valid = readAddress !== undefined;

    if (valid) {
      await this.userRepo.setVerifiedGithub(readAddress, gihub_username);
    }

    return { valid };
  }
}
