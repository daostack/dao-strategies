import { Verification } from '@dao-strategies/core';
import { VerificationIntent, LoggedUserDetails } from '@dao-strategies/core';
import { CrossVerification, Prisma, User } from '@prisma/client';

import { DISABLE_VERIFICATION } from '../config';
import { UserRepository } from '../repositories/UserRepository';

import { VerificationService } from './verification/VerificationService';

export interface UserCreateDetails {
  address: string;
}

export class UserService {
  private verifications: VerificationService;

  constructor(protected userRepo: UserRepository, token: string) {
    this.verifications = new VerificationService(token);
  }

  async exist(address: string): Promise<boolean> {
    return this.userRepo.exist(address.toLowerCase());
  }

  async get(address: string): Promise<User | undefined> {
    return this.userRepo.get(address.toLowerCase());
  }

  async getVerified(address: string): Promise<LoggedUserDetails | undefined> {
    const user = await this.get(address);
    if (!user) return undefined;

    const verifications = await this.getVerificationsTo(address);
    return {
      address,
      verifications,
    };
  }

  async getVerificationsTo(address: string): Promise<CrossVerification[]> {
    return this.userRepo.getVerificationsTo(address);
  }

  async checkVerification(
    github_username: string,
    loggedUser: string
  ): Promise<Verification> {
    const verification = !DISABLE_VERIFICATION
      ? await this.verifications.getVerificationGithub(github_username)
      : {
          from: `github:${github_username}`,
          to: `ethereum-${'all'}:${loggedUser}`,
          intent: VerificationIntent.SEND_REWARDS,
          proof: 'http://www.github.com',
        };

    if (verification) await this.userRepo.addVerification(verification);

    return verification;
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

  deleteAll(): Promise<void> {
    return this.userRepo.deleteAll();
  }
}
