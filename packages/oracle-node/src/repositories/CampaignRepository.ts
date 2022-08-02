import {
  CampaignCreateDetails,
  Balances,
  SharesToAddresses,
  bigIntToNumber,
  RootDetails,
  SharesRead,
  BalancesObject,
  Page,
} from '@dao-strategies/core';
import {
  PrismaClient,
  Prisma,
  Campaign,
  Share,
  CampaignRoot,
  BalanceLeaf,
} from '@prisma/client';
import { BigNumber, ethers } from 'ethers';

import { appLogger } from '../logger';

export interface Leaf {
  account: string;
  address: string;
  balance: string;
  proof: string[];
}

export interface AddressShares {
  account: string;
  address: string;
  amount: ethers.BigNumber;
}

export class CampaignRepository {
  constructor(protected client: PrismaClient) {}

  async create(campaignDetails: Prisma.CampaignCreateInput): Promise<Campaign> {
    return this.client.campaign.create({
      data: campaignDetails,
    });
  }

  async get(uri: string): Promise<Campaign> {
    return this.client.campaign.findUnique({ where: { uri } });
  }

  async getFromAddress(address: string): Promise<Campaign> {
    const res = await this.client.campaign.findFirst({
      where: { address: address.toLowerCase() },
      include: {
        creator: true,
      },
    });
    return res;
  }

  async exist(uri: string): Promise<boolean> {
    return this.client.campaign
      .findFirst({ where: { uri: uri } })
      .then(Boolean);
  }

  async getLastRunDate(uri: string): Promise<number | undefined> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      select: { lastRunDate: true },
    });

    if (result === null) {
      return undefined;
    }

    /** "BigInt" in the DB to support timestamps beyond 2038, "number" in JS */
    return result.lastRunDate === null
      ? undefined
      : bigIntToNumber(result.lastRunDate);
  }

  async setRunning(uri: string, value: boolean): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { running: value },
    });
  }

  async setLastRunDate(uri: string, date: number): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { lastRunDate: date },
    });
  }

  async setExecuted(uri: string, value: boolean): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { executed: value },
    });
  }

  async setPublished(uri: string, value: boolean, date: number): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { published: value, publishDate: date },
    });
  }

  async setRepublishDate(uri: string, date: number): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { republishDate: date },
    });
  }

  async getSharesPaginated(uri: string, page: Page): Promise<SharesRead> {
    const [sharesRead, total] = await this.client.$transaction([
      this.client.share.findMany({
        where: {
          campaign: {
            uri,
          },
        },
        orderBy: {
          amount: 'desc',
        },
        skip: page.skip,
        take: page.take,
      }),
      this.client.share.count({
        where: {
          campaign: {
            uri,
          },
        },
      }),
    ]);

    const shares: BalancesObject = {};
    sharesRead.forEach((share) => {
      shares[share.account] = share.amount.toString();
    });

    return {
      uri,
      shares,
      page,
      total,
    };
  }

  async getSharesAll(uri: string): Promise<Balances> {
    const sharesRead = await this.client.share.findMany({
      where: {
        campaign: {
          uri,
        },
      },
    });

    const shares: Balances = new Map();
    sharesRead.forEach((share) => {
      shares.set(share.account, BigNumber.from(share.amount));
    });

    return shares;
  }

  async countShareholders(uri: string): Promise<number> {
    const result = await this.client.share.count({
      where: {
        campaign: {
          uri,
        },
      },
    });

    return result;
  }

  async getLatestRoot(uri: string): Promise<CampaignRoot | null> {
    const root = this.client.campaignRoot.findFirst({
      where: { campaignId: uri },
      orderBy: {
        order: 'desc',
      },
    });
    return root;
  }

  async getRoot(_root: string): Promise<RootDetails> {
    const root = await this.client.campaignRoot.findFirst({
      where: { root: _root },
      include: {
        _count: {
          select: {
            leafs: true,
          },
        },
      },
    });

    if (root === null) {
      throw new Error(`Root ${_root} not found`);
    }

    return {
      root: root.root,
      order: root.order,
      uri: root.campaignId,
      date: bigIntToNumber(root.date),
      nLeafs: root._count.leafs,
    };
  }

  async getLatestRootAndLeafs(
    uri: string
  ): Promise<(CampaignRoot & { leafs: BalanceLeaf[] }) | null> {
    const root = await this.client.campaignRoot.findFirst({
      where: { campaignId: uri },
      include: {
        leafs: true,
      },
      orderBy: {
        order: 'desc',
      },
    });
    return root;
  }

  async getNewSharesToAddresses(
    uri: string,
    prev_order: number | undefined
  ): Promise<SharesToAddresses> {
    // TODO: filter existing accounts
    const result: AddressShares[] = await this.client.$queryRaw`
      SELECT account, address, amount FROM 
      (
        SELECT * FROM public."Share" 
        WHERE "campaignId" = ${uri}
      ) as shares
      LEFT JOIN 
      public."User" 
      ON shares.account = "verifiedGithub"
      `;

    const shares: SharesToAddresses = new Map();
    result.forEach((share) => {
      if (share.address != null)
        shares.set(share.address, {
          amount: ethers.BigNumber.from(share.amount.toString()),
          account: share.account,
        });
    });
    return shares;
  }

  async getSharesOfAddress(
    uri: string,
    address: string
  ): Promise<Share | null> {
    const result = await this.client.$queryRaw`
      SELECT account, address, amount FROM 
      (
        SELECT * FROM public."Share" 
        WHERE "campaignId" = ${uri}
      ) as shares
      LEFT JOIN 
      public."User" 
      ON shares.account = "verifiedGithub"
      WHERE address = ${address}
    `;

    /* eslint-disable */
    return result && (result as any).length > 0 ? result[0] : null;
    /* eslint-enable */
  }

  /** campaigns whose execution date is older and has not been executed */
  async findPendingExecution(now: number): Promise<string[]> {
    const uris = await this.client.campaign.findMany({
      where: {
        registered: true,
        execDate: {
          lte: now,
        },
        // this actually exectDate < now & (executed = false || null)
        OR: [{ executed: false }, { executed: null }],
      },
      select: {
        uri: true,
      },
    });

    return uris.map((uri) => uri.uri);
  }

  async findPendingRepublish(now: number): Promise<string[]> {
    const uris = await this.client.campaign.findMany({
      where: {
        registered: true,
        republishDate: {
          lte: now,
        },
      },
      select: {
        uri: true,
      },
    });

    return uris.map((uri) => uri.uri);
  }

  async isPendingExecution(uri: string, now: number): Promise<boolean> {
    return this.client.campaign
      .findFirst({
        where: {
          uri,
          execDate: {
            lte: now,
          },
          OR: [{ executed: false }, { executed: null }],
        },
      })
      .then(Boolean);
  }

  async isPendingPublishing(uri: string): Promise<boolean> {
    return this.client.campaign
      .findFirst({
        where: {
          uri,
          executed: true,
          OR: [{ published: false }, { published: null }],
        },
      })
      .then(Boolean);
  }

  async setShares(uri: string, shares: Balances): Promise<void> {
    const sharesArray = Array.from(shares.entries()).map(
      ([account, amount]) => {
        return { account, amount: amount.toBigInt(), campaignId: uri };
      }
    );

    const deleteExisting = this.client.share.deleteMany({
      where: {
        campaign: {
          uri,
        },
      },
    });

    const addNew = this.client.share.createMany({ data: sharesArray });

    await this.client.$transaction([deleteExisting, addNew]);
  }

  async setDetails(
    uri: string,
    details: CampaignCreateDetails,
    by: string
  ): Promise<void> {
    details.address = details.address.toLowerCase();
    const update: Prisma.CampaignUpdateArgs = {
      where: { uri },
      data: {
        ...details,
        creator: {
          connect: {
            address: by,
          },
        },
      },
    };
    await this.client.campaign.update(update);
  }

  async deleteAll(): Promise<void> {
    await this.client.campaign.deleteMany();
  }

  async isExecuted(uri: string): Promise<boolean> {
    const res = await this.client.campaign.findUnique({
      where: {
        uri,
      },
      select: {
        executed: true,
      },
    });

    return res.executed;
  }

  async addRoot(
    uri: string,
    root: string,
    leafs: Prisma.BalanceLeafCreateManyRootInput[],
    date: number,
    order: number
  ): Promise<void> {
    appLogger.info(
      `CampaignRepository - addRoot() uri: ${uri}, root: ${root}, leafs: ${JSON.stringify(
        leafs
      )}, date: ${date}`
    );

    await this.client.campaignRoot.create({
      data: {
        order,
        campaign: {
          connect: {
            uri,
          },
        },
        date,
        root,
        leafs: {
          createMany: {
            data: leafs,
          },
        },
      },
    });
  }

  async getBalanceLeaf(
    uri: string,
    root: string,
    address: string
  ): Promise<BalanceLeaf> {
    const res = await this.client.balanceLeaf.findFirst({
      where: {
        campaignId: uri,
        root: { root },
        address: address,
      },
    });
    return res;
  }

  async list(user?: string): Promise<Campaign[]> {
    const res = await this.client.campaign.findMany({
      where: { registered: true },
      take: 10,
    });
    return res;
  }
}
