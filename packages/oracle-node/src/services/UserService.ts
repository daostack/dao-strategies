import { Prisma, User } from '@prisma/client';

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
  constructor(protected userRepo: UserRepository) {}

  async exist(address: string): Promise<boolean> {
    return this.userRepo.exist(address);
  }

  async get(address: string): Promise<User | undefined> {
    return this.userRepo.get(address);
  }

  /** Sensitive method, call only after signature has been verified. */
  async getOrCreate(details: UserCreateDetails): Promise<User> {
    const exist = await this.exist(details.address);

    if (!exist) {
      const createData: Prisma.UserCreateInput = {
        address: details.address,
        github: '',
      };

      return this.create(createData);
    }

    return this.get(details.address);
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.userRepo.create(details);
  }
}
