import { PrismaClient, Prisma, User } from '@prisma/client';

export class UserRepository {
  constructor(protected client: PrismaClient) {}

  async create(userDetails: Prisma.UserCreateInput): Promise<User> {
    return this.client.user.create({
      data: userDetails,
    });
  }

  async get(address: string): Promise<User> {
    return this.client.user.findUnique({ where: { address: address } });
  }

  async clearVerifiedGithub(github_username: string): Promise<void> {
    await this.client.user.updateMany({
      where: {
        verifiedGithub: github_username,
      },
      data: {
        verifiedGithub: '',
      },
    });
  }

  async exist(address: string): Promise<boolean> {
    return this.client.user
      .findFirst({ where: { address: address } })
      .then(Boolean);
  }

  async setVerifiedGithub(
    address: string,
    github_username: string
  ): Promise<User> {
    return this.client.user.update({
      where: {
        address: address.toLowerCase(),
      },
      data: {
        verifiedGithub: github_username,
      },
    });
  }

  async setSignedGithub(
    address: string,
    github_username: string
  ): Promise<User> {
    return this.client.user.update({
      where: {
        address: address.toLowerCase(),
      },
      data: {
        signedGithub: github_username,
      },
    });
  }
}
