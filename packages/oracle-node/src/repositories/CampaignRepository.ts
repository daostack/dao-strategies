import { CampaignCreateDetails, Balances } from '@dao-strategies/core';
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

import { toNumber } from '../utils/utils';

export interface Leaf {
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
      : toNumber(result.lastRunDate);
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

  async getRewards(uri: string): Promise<Balances> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      include: {
        rewards: {
          orderBy: {
            amount: 'desc',
          },
        },
      },
    });

    const balances: Balances = new Map();
    result.rewards.forEach((reward) => {
      balances.set(reward.account, BigNumber.from(reward.amount));
    });

    return balances;
  }

  async getRewardsToAddresses(uri: string): Promise<Balances> {
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

    const balances = new Map();
    result.forEach((reward) => {
      if (reward.address != null)
        balances.set(
          reward.address,
          ethers.BigNumber.from(reward.amount.toString())
        );
    });
    return balances;
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
  async findPending(now: number): Promise<string[]> {
    const uris = await this.client.campaign.findMany({
      where: {
        registered: true,
        execDate: {
          lte: now,
        },
        OR: [{ executed: false }, { executed: null }],
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

  async setDetails(uri: string, details: CampaignCreateDetails): Promise<void> {
    details.address = details.address.toLowerCase();
    await this.client.campaign.update({ where: { uri }, data: details });
  }

  async deleteAll(): Promise<void> {
    await this.client.campaign.deleteMany();
  }

  async getIsComputing(uri: string): Promise<boolean> {
    const res = await this.client.campaign.findUnique({
      where: {
        uri,
      },
      select: {
        isComputing: true,
      },
    });

    return res.isComputing;
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

  async setIsComputing(uri: string, value: boolean): Promise<void> {
    await this.client.campaign.update({
      where: { uri: uri },
      data: { isComputing: value },
    });
  }

  async getLatestRoot(uri: string): Promise<CampaignRoot | undefined> {
    const res = await this.client.campaign.findUnique({
      where: {
        uri,
      },
      include: {
        roots: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    return res.roots.length > 0 ? res.roots[0] : undefined;
  }

  async addRoot(
    uri: string,
    root: string,
    leafs: Leaf[],
    date: number
  ): Promise<void> {
    appLogger.info(
      `CampaignRepository - addRoot() uri: ${uri}, root: ${root}, leafs: ${JSON.stringify(
        leafs
      )}, date: ${date}`
    );
    const _root = await this.client.campaignRoot.create({
      data: {
        campaignId: uri,
        date,
        root,
        balances: {
          createMany: {
            data: leafs,
          },
        },
      },
    });

    // await this.client.balanceLeaf.createMany({
    //   data: leafs.map((leaf) => {
    //     return {
    //       address: leaf.address,
    //       balance: leaf.balance,
    //       proof: leaf.proof,
    //       campaignId: uri,
    //       rootId: _root.root,
    //     };
    //   }),
    // });
  }

  async getBalanceLeaf(
    uri: string,
    root: string,
    address: string
  ): Promise<BalanceLeaf> {
    const res = await this.client.balanceLeaf.findUnique({
      where: {
        campaignId_rootId_address: {
          campaignId: uri,
          address: address,
          rootId: root,
        },
      },
    });
    return res;
  }
}
