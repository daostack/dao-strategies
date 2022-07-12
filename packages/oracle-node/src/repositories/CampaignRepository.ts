import { CampaignCreateDetails, Balances } from '@dao-strategies/core';
import { PrismaClient, Prisma, Campaign } from '@prisma/client';
import { BigNumber } from 'ethers';

import { toNumber } from '../utils/utils';

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
    const result = await this.client.$queryRaw`
      SELECT account, address, amount FROM 
      (
        SELECT * FROM public."Reward" 
        WHERE "campaignId" = '${uri}'
      ) as rewards
      LEFT JOIN 
      public."User" 
      ON rewards.account = "verifiedGithub"
    `;

    console.log(result);
    return new Map();
  }

  /** campaigns whose execution date is older and has not been executed */
  async findPending(now: number): Promise<Campaign[]> {
    return this.client.campaign.findMany({
      where: {
        execDate: {
          lte: now,
        },
        OR: [{ executed: false }, { executed: null }],
      },
    });
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
}
