import {
  bigIntToNumber,
  CampaignFundersRead,
  Page,
} from '@dao-strategies/core';
import {
  CampaignFunder,
  FundEvent,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { appLogger } from '../logger';

const DEBUG = true;

export class IndexRepository {
  constructor(protected client: PrismaClient) {}

  async getBlockOfFunders(uri: string): Promise<number> {
    const index = await this.client.campaignIndex.findUnique({
      where: {
        campaignId: uri,
      },
      select: {
        fundersBN: true,
      },
    });

    return index !== null && index.fundersBN !== null
      ? bigIntToNumber(index.fundersBN)
      : 0;
  }

  async getBlockOfTvl(uri: string): Promise<number> {
    const index = await this.client.campaignIndex.findUnique({
      where: {
        campaignId: uri,
      },
      select: {
        tvlBN: true,
      },
    });

    return index !== null && index.tvlBN !== null
      ? bigIntToNumber(index.tvlBN)
      : 0;
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

  async setFundersBlock(uri: string, fundersBN: number): Promise<void> {
    if (DEBUG)
      appLogger.debug(
        `IndexRepository - setTvlBlock uri: ${uri}, blockNumber: ${fundersBN}`
      );
    await this.client.campaignIndex.upsert({
      create: {
        fundersBN,
        campaignId: uri,
      },
      where: {
        campaignId: uri,
      },
      update: {
        fundersBN,
      },
    });
  }

  async setTvlBlock(uri: string, tvlBN: number): Promise<void> {
    if (DEBUG)
      appLogger.debug(
        `IndexRepository - setTvlBlock uri: ${uri}, blockNumber: ${tvlBN}`
      );
    await this.client.campaignIndex.upsert({
      create: {
        tvlBN,
        campaignId: uri,
      },
      where: {
        campaignId: uri,
      },
      update: {
        tvlBN,
      },
    });
  }

  async getFunders(
    uri: string,
    page: Page
  ): Promise<{
    uri: string;
    funders: (CampaignFunder & {
      campaign: {
        address: string;
      };
      events: FundEvent[];
    })[];
    page: Page;
  }> {
    const funders = await this.client.campaignFunder.findMany({
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
    });

    const total = await this.client.campaignFunder.count({
      where: {
        campaign: {
          uri,
        },
      },
    });

    const readPage = { ...page };
    readPage.total = total;
    readPage.totalPages = Math.ceil(total / page.perPage);

    return {
      uri,
      funders,
      page: readPage,
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

  /** get ALL fund events */
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

  async getFundEventsLatest(uri: string, n: number): Promise<FundEvent[]> {
    return this.client.fundEvent.findMany({
      where: {
        campaignId: uri,
      },
      orderBy: {
        blockNumber: 'desc',
      },
      skip: 0,
      take: n,
    });
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
