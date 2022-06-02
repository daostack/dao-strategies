import { Prisma, User } from '@prisma/client';
import { verifyMessage } from 'ethers/lib/utils';
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
      };

      return this.create(createData);
    }

    return this.get(details.address);
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.userRepo.create(details);
  }

  async verifyGithubOfAddress(
    signature: string,
    github_username: string
  ): Promise<{ address: string }> {
    const getMessage = (github_username: string): string => {
      return `Associate the github account "${github_username}" with this ethereum address`;
    };

    const address = verifyMessage(getMessage(github_username), signature);
    const exist = await this.exist(address);

    if (!exist)
      throw new Error(
        `trying to verify the github of address ${address}, but there is no user with this address`
      );

    await this.userRepo.setSignedGithub(address, github_username);

    return { address };
  }

  async verifyAddressOfGithub(
    gihub_username: string
  ): Promise<{ address: string }> {
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
      /** only set verified github if signedGithub is already set and the same */
      const user = await this.get(readAddress);
      if (user.signedGithub !== gihub_username) {
        throw new Error(
          `Trying to verify github ${gihub_username} for address ${readAddress}, 
          but that address current signed github account is ${user.signedGithub}`
        );
      }

      /** delete this verifiedGithub of any previously existing address*/
      await this.userRepo.clearVerifiedGithub(gihub_username);
      await this.userRepo.setVerifiedGithub(readAddress, gihub_username);
    }

    return { address: readAddress };
  }

  deleteAll(): Promise<void> {
    return this.userRepo.deleteAll();
  }
}
