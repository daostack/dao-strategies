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
        github: github_username,
      },
    });
  }
}
