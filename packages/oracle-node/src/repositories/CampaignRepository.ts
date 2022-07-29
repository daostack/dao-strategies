import {
  CampaignCreateDetails,
  Balances,
  RewardsToAddresses,
  bigIntToNumber,
} from '@dao-strategies/core';
import {
  PrismaClient,
  Prisma,
  Campaign,
  Reward,
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

export interface AddressReward {
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

  async getRewards(uri: string): Promise<Balances> {
    const result = await this.client.reward.findMany({
      where: {
        campaign: {
          uri,
        },
      },
      orderBy: {
        amount: 'desc',
      },
    });

    const balances: Balances = new Map();
    result.forEach((reward) => {
      balances.set(reward.account, BigNumber.from(reward.amount));
    });

    return balances;
  }

  async countRewards(uri: string): Promise<number> {
    const result = await this.client.reward.count({
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

  async getLatestRootAndLeafs(
    uri: string
  ): Promise<(CampaignRoot & { balances: BalanceLeaf[] }) | null> {
    const root = await this.client.campaignRoot.findFirst({
      where: { campaignId: uri },
      include: {
        balances: true,
      },
      orderBy: {
        order: 'desc',
      },
    });
    return root;
  }

  async getNewRewardsToAddresses(
    uri: string,
    prev_order: number | undefined
  ): Promise<RewardsToAddresses> {
    // TODO: filter existing accounts
    const result: AddressReward[] = await this.client.$queryRaw`
      SELECT account, address, amount FROM 
      (
        SELECT * FROM public."Reward" 
        WHERE "campaignId" = ${uri}
      ) as rewards
      LEFT JOIN 
      public."User" 
      ON rewards.account = "verifiedGithub"
      `;

    const rewards: RewardsToAddresses = new Map();
    result.forEach((reward) => {
      if (reward.address != null)
        rewards.set(reward.address, {
          amount: ethers.BigNumber.from(reward.amount.toString()),
          account: reward.account,
        });
    });
    return rewards;
  }

  async getRewardToAddress(
    uri: string,
    address: string
  ): Promise<Reward | null> {
    const result = await this.client.$queryRaw`
      SELECT account, address, amount FROM 
      (
        SELECT * FROM public."Reward" 
        WHERE "campaignId" = ${uri}
      ) as rewards
      LEFT JOIN 
      public."User" 
      ON rewards.account = "verifiedGithub"
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

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    const rewardsArray = Array.from(rewards.entries()).map(
      ([account, amount]) => {
        return { account, amount: amount.toBigInt(), campaignId: uri };
      }
    );

    const deleteExisting = this.client.reward.deleteMany({
      where: {
        campaign: {
          uri,
        },
      },
    });

    const addNew = this.client.reward.createMany({ data: rewardsArray });

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
    date: number
  ): Promise<void> {
    appLogger.info(
      `CampaignRepository - addRoot() uri: ${uri}, root: ${root}, leafs: ${JSON.stringify(
        leafs
      )}, date: ${date}`
    );
    const latest = await this.getLatestRoot(uri);
    await this.client.campaignRoot.create({
      data: {
        order: latest !== null ? latest.order : 0,
        campaign: {
          connect: {
            uri,
          },
        },
        date,
        root,
        balances: {
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
