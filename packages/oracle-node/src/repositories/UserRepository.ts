import { PrismaClient, Prisma, User, CrossVerification } from '@prisma/client';

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

  async deleteAll(): Promise<void> {
    await this.client.user.deleteMany();
  }

  async addVerification(verification: CrossVerification): Promise<void> {
    const current = await this.client.crossVerification.findUnique({
      where: {
        from_to_intent: {
          from: verification.from,
          to: verification.to,
          intent: verification.intent,
        },
      },
    });

    if (current === null) {
      await this.client.crossVerification.create({ data: verification });
    }
  }

  async getVerificationsTo(address: string): Promise<CrossVerification[]> {
    return this.client.crossVerification.findMany({
      where: {
        to: {
          endsWith: address.toLocaleLowerCase(),
        },
      },
    });
  }

  async getVerificationsFrom(username: string): Promise<CrossVerification[]> {
    return this.client.crossVerification.findMany({
      where: {
        from: username,
      },
    });
  }
}
