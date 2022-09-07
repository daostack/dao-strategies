import {
  bigIntToNumber,
  CampaignFundersRead,
  Page,
} from '@dao-strategies/core';
import { FundEvent, Prisma, PrismaClient } from '@prisma/client';

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

  async addFundEvent(event: Prisma.FundEventCreateInput): Promise<void> {
    const exist = await this.client.fundEvent.findUnique({
      where: { hash: event.hash },
    });
    if (exist) return;

    await this.client.fundEvent.create({
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
        orderBy: { value: 'desc' },
        include: {
          campaign: {
            select: {
              address: true,
            },
          },
          events: true,
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
          uri,
          funder: funder.address,
          value: funder.value,
          fundEvents: funder.events.map((event) => {
            return {
              uri,
              funder: event.funderAddress,
              asset: event.asset,
              amount: event.amount,
              blockNumber: bigIntToNumber(event.blockNumber),
              txHash: event.hash,
            };
          }),
        };
      }),
      page,
    };
  }

  async funderExist(uri: string, address: string): Promise<boolean> {
    return this.client.campaignFunder
      .findUnique({
        where: {
          campaignId_address: {
            campaignId: uri,
            address,
          },
        },
      })
      .then(Boolean);
  }

  async createFunder(data: Prisma.CampaignFunderCreateInput): Promise<void> {
    await this.client.campaignFunder.create({ data });
  }

  getFundEvents(uri: string, addresses?: string[]): Promise<FundEvent[]> {
    if (addresses !== undefined && addresses.length > 0) {
      return addresses.length > 1
        ? this.client.fundEvent.findMany({
            where: {
              campaignId: uri,
              funderAddress: {
                in: addresses,
              },
            },
          })
        : this.client.fundEvent.findMany({
            where: {
              campaignId: uri,
              funderAddress: addresses[0],
            },
          });
    } else {
      /** return all fund events of all funders */
      return this.client.fundEvent.findMany({
        where: {
          campaignId: uri,
        },
      });
    }
  }

  async upsertFunder(
    funder: Prisma.CampaignFunderUncheckedCreateInput
  ): Promise<void> {
    await this.client.campaignFunder.upsert({
      where: {
        campaignId_address: {
          campaignId: funder.campaignId,
          address: funder.address,
        },
      },
      create: funder,
      update: {
        value: funder.value,
      },
    });
  }
}