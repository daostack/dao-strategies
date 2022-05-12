import { BigNumber } from 'ethers';
import { Balances } from '@dao-strategies/core';
import { PrismaClient, Prisma, Campaign, Reward } from '@prisma/client';
import { getRewardUri } from '../services/CampaignUri';

export class CampaignRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async create(campaignDetails: Prisma.CampaignCreateInput) {
    await this.client.campaign.create({
      data: campaignDetails,
    });
  }

  async get(uri: string): Promise<Campaign> {
    return this.client.campaign.findUnique({ where: { uri: uri } });
  }

  async exist(uri: string): Promise<boolean> {
    return this.client.campaign
      .findFirst({ where: { uri: uri } })
      .then(Boolean);
  }

  async getLastSimDate(uri: string): Promise<number | undefined> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      select: { lastSimDate: true },
    });

    if (result === null) {
      return undefined;
    }

    /** "BigInt" in the DB to support timestamps beyond 2038, "number" in JS */
    return result.lastSimDate === null
      ? undefined
      : (result.lastSimDate as unknown as number);
  }

  async getRewards(uri: string): Promise<Balances> {
    const result = await this.client.campaign.findUnique({
      where: { uri: uri },
      include: {
        rewards: true,
      },
    });

    const balances: Balances = new Map();
    result.rewards.forEach((reward) => {
      balances.set(reward.account, BigNumber.from(reward.amount));
    });

    return balances;
  }

  async setRewards(uri: string, rewards: Balances): Promise<void> {
    const rewardsArray = await Promise.all(
      Array.from(rewards.entries()).map(async ([account, amount]) => {
        const id = await getRewardUri(uri, account);
        return { id, account, amount: amount.toBigInt(), campaignId: uri };
      })
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
}
