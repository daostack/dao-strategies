import {
  bigIntToNumber,
  CampaignFundersRead,
  Page,
} from '@dao-strategies/core';
import { CampaignFunder, Prisma, PrismaClient } from '@prisma/client';
import { appLogger } from '../logger';

const DEBUG = true;

export class IndexRepository {
  constructor(protected client: PrismaClient) {}

  async getBlockOf(uri: string): Promise<number> {
    const index = await this.client.campaignIndex.findUnique({
      where: {
        campaignId: uri,
      },
    });

    return index !== null ? bigIntToNumber(index.blockNumber) : 0;
  }

  async addFundEvent(
    event: Prisma.CampaignFunderUncheckedCreateInput
  ): Promise<void> {
    await this.client.campaignFunder.create({
      data: event,
    });
  }

  async addIndexMark(uri: string, blockNumber: number): Promise<void> {
    if (DEBUG)
      appLogger.debug(
        `IndexRepository - addIndexMark uri: ${uri}, blockNumber: ${blockNumber}`
      );
    await this.client.campaignIndex.upsert({
      create: {
        blockNumber,
        campaignId: uri,
      },
      where: {
        campaignId: uri,
      },
      update: {
        blockNumber,
      },
    });
  }

  async getFunders(uri: string, page: Page): Promise<CampaignFundersRead> {
    const [funders, total] = await this.client.$transaction([
      this.client.campaignFunder.findMany({
        where: { campaign: { uri } },
        orderBy: { amount: 'desc' },
        include: {
          campaign: {
            select: {
              address: true,
            },
          },
        },
        skip: page.number * page.perPage,
        take: page.perPage,
      }),
      this.client.campaignFunder.count({
        where: {
          campaign: {
            uri,
          },
        },
      }),
    ]);

    page.total = total;
    page.totalPages = Math.ceil(total / page.perPage);

    return {
      uri,
      funders: funders.map((funder) => {
        return {
          campaignAddress: funder.campaign.address,
          funder: funder.funder,
          amount: funder.amount,
          blockNumber: bigIntToNumber(funder.blockNumber),
          txHash: funder.hash,
        };
      }),
      page,
    };
  }
}
