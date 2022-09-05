import { bigIntToNumber } from '@dao-strategies/core';
import { PrismaClient } from '@prisma/client';

export interface FundEvent {
  uri: string;
  funder: string;
  amount: string;
  blockNumber: number;
}

export class IndexRepository {
  constructor(protected client: PrismaClient) {}

  async getBlockOf(uri: string): Promise<number> {
    const { blockNumber } = await this.client.campaignIndexed.findUnique({
      where: {
        campaignId: uri,
      },
      select: { blockNumber: true },
    });

    return bigIntToNumber(blockNumber);
  }

  async addFundEvent(event: FundEvent): Promise<void> {
    await this.client.campaignIndexed.create({
      data: {
        campaignId: event.uri,
        ...event,
      },
    });
  }
}
