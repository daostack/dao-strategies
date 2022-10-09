import { getAddressStrict, VerificationIntent } from '@dao-strategies/core';
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

    const uniqueIntents = [VerificationIntent.SEND_REWARDS];

    if (current === null) {
      /** delete previous verifications if intent must be unique */
      if (uniqueIntents.includes(verification.intent as VerificationIntent)) {
        await this.client.crossVerification.deleteMany({
          where: {
            from: verification.from,
            intent: verification.intent,
          },
        });
      }

      await this.client.crossVerification.create({ data: verification });
    }
  }

  async getVerificationsTo(address: string): Promise<CrossVerification[]> {
    return this.client.crossVerification.findMany({
      where: {
        to: {
          endsWith: getAddressStrict(address),
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
